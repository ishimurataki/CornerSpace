import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/get-canvas-card';
import { AppSyncIdentityCognito, AppSyncIdentityIAM } from 'aws-lambda';
import { listCanvasesByCanvasId } from '../../graphql/queries';
import { generateClient } from 'aws-amplify/data';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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

export const handler: Schema["getCanvasCard"]["functionHandler"] = async (event, context) => {
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
        return { isCanvasCardReturned: false, canvasCard: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!listCanvasData.listCanvasesByCanvasId || listCanvasData.listCanvasesByCanvasId.items.length === 0) {
        return {
            isCanvasCardReturned: false,
            canvasCard: null,
            errorMessage: `Requested canvasId ${canvasId} not found.`
        };
    }

    const canvasMetaData = listCanvasData.listCanvasesByCanvasId.items[0];

    const authorizedAccess = canvasMetaData.publicity === "PUBLIC" ||
        canvasMetaData.ownerCognitoId === callerUsername;

    if (!authorizedAccess) {
        return {
            isCanvasCardReturned: false,
            canvasCard: null,
            errorMessage: `Access to canvasId ${canvasId} is not authorized.`
        };
    }

    const canvasThumbnailGetCommand = new GetObjectCommand({
        Bucket: env.CANVASES_BUCKET_NAME,
        Key: `canvasThumbnails/${canvasMetaData.ownerUsername}/${canvasId}`
    });

    try {
        const data = await s3Client.send(canvasThumbnailGetCommand);
        const thumbnail = await data.Body?.transformToString();

        const canvasCard = {
            ownerUsername: canvasMetaData.ownerUsername,
            name: canvasMetaData.name,
            description: canvasMetaData.description,
            publicity: canvasMetaData.publicity,
            thumbnail: thumbnail ? thumbnail : ""
        };
        return { isCanvasCardReturned: true, canvasCard: canvasCard, errorMessage: null };
    } catch (error) {
        console.log("s3 get failure: " + error);
        return { isCanvasCardReturned: false, canvasCard: null, errorMessage: "500 - Internal Server Error." };
    }
};