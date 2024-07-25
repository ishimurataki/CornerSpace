import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/create-canvas-for-user';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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

const dynamoDBClient = new DynamoDBClient({});
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const handler: Schema["getPublicCanvasIdsForUser"]["functionHandler"] = async (event, context) => {
    const { ownerUsername } = event.arguments;

    console.log(`Starting getPublicCanvasIdsForUser lambda function invocation for ${ownerUsername}.`);

    const queryCommand = new QueryCommand({
        TableName: "Canvases-zbc4ytvn7bgdxfym6bbpnpl2gu-NONE",
        ProjectionExpression: "canvasId,publicity",
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
    const canvasIds: string[] = response.Items
        .filter((canvas) => canvas.publicity === "PUBLIC")
        .map((canvas) => canvas.canvasId);

    return { areCanvasIdsReturned: true, canvasIds: canvasIds, errorMessage: null };
};