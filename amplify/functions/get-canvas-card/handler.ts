import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/create-canvas-for-user';
import { AppSyncIdentityCognito, AppSyncIdentityIAM } from 'aws-lambda';
import { getCanvases } from '../../graphql/queries';
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
    const { ownerUsername, canvasId } = event.arguments;
    console.log(`Starting getCanvasCard lambda function invocation for user ${ownerUsername} for canvasId ${canvasId}.`);

    // const canvasCard = {
    //     ownerUsername: "fakeUsername",
    //     name: "fakeCanvasName",
    //     description: "fakeCanvasDescription",
    //     publicity: "fakePublicity",
    //     thumbnail: "fakeThumbnail"
    // }

    return {
        isCanvasCardReturned: true, ownerUsername: "fakeUsername",
        name: "fakeCanvasName",
        description: "fakeCanvasDescription",
        publicity: "fakePublicity",
        thumbnail: "fakeThumbnail", errorMessage: null
    }

    // const callerUsername = (event.identity as (AppSyncIdentityIAM | AppSyncIdentityCognito)).username;

    // const { data: getCanvasData, errors: getCanvasErrors } = await client.graphql({
    //     query: getCanvases,
    //     variables: {
    //         ownerUsername: ownerUsername,
    //         canvasId: canvasId
    //     },
    // });
    // if (getCanvasErrors) {
    //     console.log(getCanvasErrors);
    //     return { isCanvasCardReturned: false, canvasCard: null, errorMessage: "500 - Internal Server Error." };
    // }
    // if (!getCanvasData.getCanvases) {
    //     return {
    //         isCanvasCardReturned: false,
    //         canvasCard: null,
    //         errorMessage: `Requested canvasId ${canvasId} not found for user ${ownerUsername}.`
    //     };
    // }

    // const authorizedAccess = getCanvasData.getCanvases.publicity === "PUBLIC" ||
    //     getCanvasData.getCanvases.ownerCognitoId === callerUsername;

    // if (!authorizedAccess) {
    //     return {
    //         isCanvasCardReturned: false,
    //         canvasCard: null,
    //         errorMessage: `Access to canvasId ${canvasId} belonging to user ${ownerUsername} is not authorized.`
    //     };
    // }

    // const canvasThumbnailGetCommand = new GetObjectCommand({
    //     Bucket: env.CANVASES_BUCKET_NAME,
    //     Key: `canvasThumbnails/${ownerUsername}/${canvasId}`
    // });

    // try {
    //     const data = await s3Client.send(canvasThumbnailGetCommand);
    //     const thumbnail = await data.Body?.transformToString();
    //     console.log(thumbnail);
    //     console.log("here is some other data:");
    //     console.log("name: " + getCanvasData.getCanvases.name);
    //     console.log("description: " + getCanvasData.getCanvases.name);
    //     console.log("description: " + getCanvasData.getCanvases);

    //     // const canvasCard = {
    //     //     ownerUsername: ownerUsername,
    //     //     name: getCanvasData.getCanvases.name,
    //     //     description: getCanvasData.getCanvases.description,
    //     //     publicity: getCanvasData.getCanvases.publicity,
    //     //     thumbnail: thumbnail ? thumbnail : ""
    //     // }

    //     const canvasCard = {
    //         ownerUsername: "fakeUsername",
    //         name: "fakeCanvasName",
    //         description: "fakeCanvasDescription",
    //         publicity: "fakePublicity",
    //         thumbnail: "fakeThumbnail"
    //     }

    //     return { isCanvasCardReturned: true, canvasCard: canvasCard, errorMessage: null }
    // } catch (error) {
    //     console.log("s3 get failure: " + error);
    //     return { isCanvasCardReturned: false, canvasCard: null, errorMessage: "500 - Internal Server Error." };
    // }
};