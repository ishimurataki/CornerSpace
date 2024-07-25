import type { AppSyncIdentityCognito } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/delete-canvas-for-user';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { deleteCanvases } from '../../graphql/mutations';
import { listCanvasesByCanvasId } from '../../graphql/queries';

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

export const handler: Schema["deleteCanvasForUser"]["functionHandler"] = async (event, context) => {
    const { canvasId } = event.arguments;

    console.log(`Starting deleteCanvasForUser lambda function invocation for canvasId ${canvasId}.`)

    const ownerCognitoId = (event.identity as AppSyncIdentityCognito).username;

    const { data: listCanvasData, errors: listCanvasErrors } = await client.graphql({
        query: listCanvasesByCanvasId,
        variables: {
            canvasId: canvasId
        },
    });
    if (listCanvasErrors) {
        console.log(listCanvasErrors);
        return { isCanvasDeleted: false, errorMessage: "500 - Internal Server Error." };
    }
    if (!listCanvasData.listCanvasesByCanvasId || listCanvasData.listCanvasesByCanvasId.items.length === 0) {
        return {
            isCanvasDeleted: false,
            errorMessage: `Requested canvasId ${canvasId} not found.`
        };
    }

    const canvasMetaData = listCanvasData.listCanvasesByCanvasId.items[0];

    const authorizedAccess = canvasMetaData.ownerCognitoId === ownerCognitoId;

    if (!authorizedAccess) {
        return {
            isCanvasDeleted: false,
            errorMessage: `Access to canvasId ${canvasId} is not authorized.`
        };
    }

    const ownerUsername = canvasMetaData.ownerUsername;

    const { errors: deleteCanvasErrors } = await client.graphql({
        query: deleteCanvases,
        variables: {
            input: {
                ownerUsername: ownerUsername,
                canvasId: canvasId
            }
        }
    });
    if (deleteCanvasErrors) {
        console.log(deleteCanvasErrors);
        return { isCanvasDeleted: false, errorMessage: "500 - Internal Server Error." };
    }

    // Delete canvas from storage
    const canvasDataDeleteCommand = new DeleteObjectCommand({
        Bucket: env.CANVASES_BUCKET_NAME,
        Key: `canvases/${ownerUsername}/${canvasId}`,
    });
    const canvasThumbnailDeleteCommand = new DeleteObjectCommand({
        Bucket: env.CANVASES_BUCKET_NAME,
        Key: `canvasThumbnails/${ownerUsername}/${canvasId}`
    });

    try {
        await s3Client.send(canvasDataDeleteCommand);
        await s3Client.send(canvasThumbnailDeleteCommand);
    } catch (error) {
        console.log("s3 delete failure: " + error);
        return { isCanvasDeleted: false, errorMessage: "500 - Internal Server Error." };
    }

    return { isCanvasDeleted: true, errorMessage: null };
};