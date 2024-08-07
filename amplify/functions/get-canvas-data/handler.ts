import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/get-canvas-data';
import { AppSyncIdentityCognito, AppSyncIdentityIAM } from 'aws-lambda';
import { generateClient } from 'aws-amplify/data';
import { getCanvasSocialStats, listCanvasesByCanvasId } from '../../graphql/queries';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { updateCanvasSocialStats } from '../../graphql/mutations';

Amplify.configure(
    {
        API: {
            GraphQL: {
                endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
                region: env.AWS_REGION,
                defaultAuthMode: 'iam'
            }
        }
    },
    {
        Auth: {
            credentialsProvider: {
                getCredentialsAndIdentityId: async () => ({
                    credentials: {
                        accessKeyId: env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
                        sessionToken: env.AWS_SESSION_TOKEN,
                    },
                }),
                clearCredentialsAndIdentityId: () => {
                    /* noop */
                },
            },
        },
    }
);

const client = generateClient<Schema>({
    authMode: "iam",
});

const s3Client = new S3Client();

export const handler: Schema["getCanvasData"]["functionHandler"] = async (event, context) => {
    const { canvasId } = event.arguments;
    console.log(`Starting getCanvasCard lambda function invocation for canvasId ${canvasId}.`);

    const callerUsername = (event.identity as (AppSyncIdentityIAM | AppSyncIdentityCognito)).username;

    const { data: listCanvasData, errors: listCanvasErrors } = await client.graphql({
        query: listCanvasesByCanvasId,
        variables: {
            canvasId: canvasId
        },
    });
    if (listCanvasErrors) {
        console.log(listCanvasErrors);
        return { isCanvasDataReturned: false, canvasData: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!listCanvasData.listCanvasesByCanvasId || listCanvasData.listCanvasesByCanvasId.items.length === 0) {
        return {
            isCanvasDataReturned: false,
            canvasData: null,
            errorMessage: `Requested canvasId ${canvasId} not found.`
        };
    }

    const canvasMetaData = listCanvasData.listCanvasesByCanvasId.items[0];

    const authorizedAccess = canvasMetaData.publicity === "PUBLIC" ||
        canvasMetaData.ownerCognitoId === callerUsername;

    if (!authorizedAccess) {
        return {
            isCanvasDataReturned: false,
            canvasData: null,
            errorMessage: `Access to canvasId ${canvasId} is not authorized.`
        };
    }

    const { data: getCanvasSocialStatsData, errors: getCanvasSocialStatsErrors } = await client.graphql({
        query: getCanvasSocialStats,
        variables: {
            ownerUsername: canvasMetaData.ownerUsername,
            canvasId: canvasId
        },
    });
    if (getCanvasSocialStatsErrors) {
        console.log(getCanvasSocialStatsErrors);
        return { isCanvasDataReturned: false, canvasData: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!getCanvasSocialStatsData.getCanvasSocialStats) {
        return {
            isCanvasDataReturned: false,
            canvasData: null,
            errorMessage: `Social stats for requested canvasId ${canvasId} not found.`
        };
    }
    const canvasSocialStats = getCanvasSocialStatsData.getCanvasSocialStats;

    const guestAccess = canvasMetaData.ownerCognitoId !== callerUsername;
    if (guestAccess) {
        canvasSocialStats.viewCount++;
        await client.graphql({
            query: updateCanvasSocialStats,
            variables: {
                input: {
                    ownerUsername: canvasMetaData.ownerUsername,
                    canvasId: canvasId,
                    viewCount: canvasSocialStats.viewCount
                }
            }
        })
    }

    const canvasDataGetCommand = new GetObjectCommand({
        Bucket: env.CANVASES_BUCKET_NAME,
        Key: `canvases/${canvasMetaData.ownerUsername}/${canvasId}`
    });

    try {
        const data = await s3Client.send(canvasDataGetCommand);
        const canvasData = await data.Body?.transformToString();

        const canvasDataToReturn = {
            ownerUsername: canvasMetaData.ownerUsername,
            name: canvasMetaData.name,
            description: canvasMetaData.description,
            publicity: canvasMetaData.publicity,
            likeCount: canvasSocialStats.likeCount,
            viewCount: canvasSocialStats.viewCount,
            canvasData: canvasData ? canvasData : ""
        };

        return { isCanvasDataReturned: true, canvasData: canvasDataToReturn, errorMessage: null };
    } catch (error) {
        console.log("s3 get failure: " + error);
        return { isCanvasDataReturned: false, canvasData: null, errorMessage: "500 - Internal Server Error." };
    }
};