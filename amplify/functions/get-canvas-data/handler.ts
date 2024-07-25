import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/create-canvas-for-user';
import { AppSyncIdentityCognito, AppSyncIdentityIAM } from 'aws-lambda';
import { generateClient } from 'aws-amplify/data';
import { getCanvases } from '../../graphql/queries';

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

export const handler: Schema["getCanvasData"]["functionHandler"] = async (event, context) => {
    const { ownerUsername, canvasId } = event.arguments;
    console.log(`Starting getCanvasCard lambda function invocation for user ${ownerUsername} for canvasId ${canvasId}.`);

    const callerUsername = (event.identity as (AppSyncIdentityIAM | AppSyncIdentityCognito)).username;

    const { data: getCanvasData, errors: getCanvasErrors } = await client.graphql({
        query: getCanvases,
        variables: {
            ownerUsername: ownerUsername,
            canvasId: canvasId
        },
    });
    if (getCanvasErrors) {
        console.log(getCanvasErrors);
        return { isCanvasDataReturned: false, canvasData: null, errorMessage: "500 - Internal Server Error." };
    }
    console.log("HERE");
    console.log(getCanvasData.getCanvases);
    if (!getCanvasData.getCanvases) {
        return {
            isCanvasDataReturned: false,
            canvasData: null,
            errorMessage: `Requested canvasId ${canvasId} not found for user ${ownerUsername}`
        };
    }
    return { isCanvasDataReturned: false, canvasData: null, errorMessage: "Function incomplete." }
};