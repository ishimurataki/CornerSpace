import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/create-canvas-for-user';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { generateClient } from 'aws-amplify/data';
import { AppSyncIdentityCognito } from 'aws-lambda';
import { getUsers } from '../../graphql/queries';

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

const dynamoDBClient = new DynamoDBClient({});
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const handler: Schema["getAllCanvasIdsForAuthenticatedUser"]["functionHandler"] = async (event, context) => {
    const { ownerUsername } = event.arguments;

    console.log(`Starting getAllCanvasIdsForAuthenticatedUser lambda function invocation for ${ownerUsername}.`);

    const ownerCognitoId = (event.identity as AppSyncIdentityCognito).username;
    const { data: getUserData, errors: getUserErrors } = await dataClient.graphql({
        query: getUsers,
        variables: {
            username: ownerUsername
        },
    });
    if (getUserErrors || !getUserData.getUsers) {
        console.log(getUserErrors);
        return { areCanvasIdsReturned: false, canvasIds: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!getUserData.getUsers.cognitoId) {
        return { areCanvasIdsReturned: false, canvasIds: null, errorMessage: "500 - User cognitoId unavailable." };
    }
    if (getUserData.getUsers.cognitoId !== ownerCognitoId) {
        return {
            areCanvasIdsReturned: false, canvasIds: null,
            errorMessage: "400 - Authenticated user does not match requested username."
        };
    }

    const queryCommand = new QueryCommand({
        TableName: "Canvases-mt3da4wpdbbf5i2vssvzjqur4m-NONE",
        ProjectionExpression: "canvasId",
        KeyConditionExpression:
            "ownerUsername = :user",
        ExpressionAttributeValues: {
            ":user": ownerUsername
        },
        ConsistentRead: true,
    });

    const response = await dynamoDocClient.send(queryCommand);
    if (response.$metadata.httpStatusCode !== 200 || !response.Items) {
        console.log("DDB query command failed.");
        return { areCanvasIdsReturned: false, canvasIds: null, errorMessage: "500 - Internal Server Error." };
    }
    const canvasIds: string[] = response.Items.map((canvas) => canvas.canvasId);

    return { areCanvasIdsReturned: true, canvasIds: canvasIds, errorMessage: null };
};