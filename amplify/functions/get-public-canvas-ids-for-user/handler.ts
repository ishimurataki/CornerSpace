import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/get-public-canvas-ids-for-user';
import { generateClient } from 'aws-amplify/data';
import { listCanvases } from '../../graphql/queries';

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

const dataClient = generateClient<Schema>({
    authMode: "iam",
});

export const handler: Schema["getPublicCanvasIdsForUser"]["functionHandler"] = async (event, context) => {
    const { ownerUsername } = event.arguments;

    console.log(`Starting getPublicCanvasIdsForUser lambda function invocation for ${ownerUsername}.`);

    const { data: listCanvasesData, errors: listCanvasesErrors } = await dataClient.graphql({
        query: listCanvases,
        variables: {
            ownerUsername: ownerUsername
        }
    });
    if (listCanvasesErrors) {
        console.log(listCanvasesErrors);
        return { areCanvasIdsReturned: false, canvasIds: null, errorMessage: "500 - Internal Server Error." };
    }
    const canvases = listCanvasesData.listCanvases.items;
    const canvasIds: string[] = canvases
        .filter((canvas) => canvas.publicity === "PUBLIC")
        .map((canvas) => canvas.canvasId);

    return { areCanvasIdsReturned: true, canvasIds: canvasIds, errorMessage: null };
};