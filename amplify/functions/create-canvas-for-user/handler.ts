import type { AppSyncIdentityCognito, Handler } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/create-canvas-for-user';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getUsers } from '../../graphql/queries';
import { createCanvases, updateCanvases } from '../../graphql/mutations';

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

export const handler: Schema["createCanvasForUser"]["functionHandler"] = async (event, context) => {
    // your function code goes here
    const { ownerUsername, canvasId, name, description, publicity, canvasData } = event.arguments;
    const isNewCanvas = !canvasId;
    let newCanvasId: string = canvasId ? canvasId : "";

    console.log("starting createCanvasForUser lambda function invocation with arguments:")
    console.log(ownerUsername);
    console.log(canvasId);
    console.log(canvasData);

    const ownerCognitoId = (event.identity as AppSyncIdentityCognito).username;

    // Obtain correct canvasId
    const queryCommand = new QueryCommand({
        TableName: "Canvases-yfnnvnwepjgyrmfl43tns5vkqa-NONE",
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
        console.log("500 - Internal Server Error. DDB query command failed.");
        return "500 - Internal Server Error. DDB query command failed.";
    }
    const canvases = response.Items;
    if (canvasId && !canvases.some((canvas) => canvas.canvasId == canvasId)) {
        return "Invalid canvas ID."
    } else if (!canvasId) {
        const { data: getUserData, errors: getUsersError } = await dataClient.graphql({
            query: getUsers,
            variables: {
                username: ownerUsername
            }
        });
        if (getUsersError || !getUserData.getUsers) {
            return "500 - Internal Server Error." + getUsersError;
        }
        if (!getUserData.getUsers.numberOfCanvases) {
            return "User max canvas count unavailable."
        }
        const maxNumberOfCanvases = getUserData.getUsers.numberOfCanvases;
        const currentNumberOfCanvases = canvases.length;
        console.log("max number of canvases: " + maxNumberOfCanvases);
        console.log("current number of canvases: " + currentNumberOfCanvases);
        if (currentNumberOfCanvases >= maxNumberOfCanvases) {
            return "Max number of canvases reached."
        }
        newCanvasId = uuidv4();
    }

    if (isNewCanvas) {
        console.log("Here 3");
        const result = await dataClient.graphql({
            query: createCanvases,
            variables: {
                input: {
                    ownerUsername: ownerUsername,
                    ownerCognitoId: ownerCognitoId,
                    canvasId: newCanvasId,
                    name: name,
                    description: description,
                    publicity: publicity
                },
            },
        });
        console.log(result);
    } else {
        console.log("Here 4");
        const result = await dataClient.graphql({
            query: updateCanvases,
            variables: {
                input: {
                    ownerUsername: ownerUsername,
                    ownerCognitoId: ownerCognitoId,
                    canvasId: newCanvasId,
                    name: name,
                    description: description,
                    publicity: publicity
                },
            }
        })
        console.log(result);
    }

    return "new canvas ID is:" + newCanvasId;
};