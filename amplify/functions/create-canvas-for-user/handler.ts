import type { AppSyncIdentityCognito } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/create-canvas-for-user';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getUsers, listCanvases } from '../../graphql/queries';
import {
    createCanvases, updateCanvases,
    deleteCanvases, deleteCanvasSocialStats
} from '../../graphql/mutations';

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

const s3Client = new S3Client();

export const handler: Schema["createCanvasForUser"]["functionHandler"] = async (event, context) => {
    const { ownerUsername, canvasId, name, description, publicity, canvasData, canvasThumbail } = event.arguments;
    const isNewCanvas = !canvasId;
    let newCanvasId: string = canvasId ? canvasId : "";

    console.log(`Starting createCanvasForUser lambda function invocation for ${ownerUsername}.`)

    const ownerCognitoId = (event.identity as AppSyncIdentityCognito).username;
    const { data: getUserData, errors: getUserErrors } = await dataClient.graphql({
        query: getUsers,
        variables: {
            username: ownerUsername
        },
    });
    if (getUserErrors || !getUserData.getUsers) {
        console.log(getUserErrors);
        return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!getUserData.getUsers.cognitoId) {
        return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - User cognitoId unavailable." };
    }
    if (getUserData.getUsers.cognitoId !== ownerCognitoId) {
        return {
            isCanvasSaved: false, canvasId: null,
            errorMessage: "400 - Authenticated user does not match requested username."
        };
    }

<<<<<<< HEAD
    // Obtain correct canvasId
    const queryCommand = new QueryCommand({
        TableName: "Canvases-zbc4ytvn7bgdxfym6bbpnpl2gu-NONE",
        ProjectionExpression: "canvasId",
        KeyConditionExpression:
            "ownerUsername = :user",
        ExpressionAttributeValues: {
            ":user": ownerUsername
        },
        ConsistentRead: true,
=======
    const { data: listCanvasesData, errors: listCanvasesErrors } = await dataClient.graphql({
        query: listCanvases,
        variables: {
            ownerUsername: ownerUsername
        }
>>>>>>> dc9571a (Set up new canvas digest processing as a ddb streams lambda trigger)
    });
    if (listCanvasesErrors) {
        console.log(listCanvasesErrors);
        return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - Internal Server Error." };
    }
    const canvases = listCanvasesData.listCanvases.items

    if (canvasId && !canvases.some((canvas) => canvas.canvasId == canvasId)) {
        return { isCanvasSaved: false, canvasId: null, errorMessage: "400 - Invalid canvas ID." };
    } else if (!canvasId) {
        if (!getUserData.getUsers.numberOfCanvases) {
            return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - User max canvas count unavailable." };
        }
        const maxNumberOfCanvases = getUserData.getUsers.numberOfCanvases;
        const currentNumberOfCanvases = canvases.length;
        if (currentNumberOfCanvases >= maxNumberOfCanvases) {
            return { isCanvasSaved: false, canvasId: null, errorMessage: "400 - Max number of canvases reached." };
        }
        newCanvasId = uuidv4();
    }

    if (isNewCanvas) {
        const { errors: createCanvasErrors } = await dataClient.graphql({
            query: createCanvases,
            variables: {
                input: {
                    ownerUsername: ownerUsername,
                    ownerCognitoId: `${ownerCognitoId}::${ownerCognitoId}`,
                    canvasId: newCanvasId,
                    name: name,
                    description: description,
                    publicity: publicity
                },
            },
        });
        if (createCanvasErrors) {
            console.log(createCanvasErrors);
            return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - Internal Server Error." };
        }
    } else {
        const { errors: updateCanvasErrors } = await dataClient.graphql({
            query: updateCanvases,
            variables: {
                input: {
                    ownerUsername: ownerUsername,
                    ownerCognitoId: `${ownerCognitoId}::${ownerCognitoId}`,
                    canvasId: newCanvasId,
                    name: name,
                    description: description,
                    publicity: publicity
                },
            }
        });
        if (updateCanvasErrors) {
            console.log(updateCanvasErrors);
            return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - Internal Server Error." };
        }
    }
    // Save canvas to storage
    const canvasDataUploadCommand = new PutObjectCommand({
        Bucket: env.CANVASES_BUCKET_NAME,
        Key: `canvases/${ownerUsername}/${newCanvasId}`,
        Body: canvasData
    });
    const canvasThumbnailUploadCommand = new PutObjectCommand({
        Bucket: env.CANVASES_BUCKET_NAME,
        Key: `canvasThumbnails/${ownerUsername}/${newCanvasId}`,
        Body: canvasThumbail
    });

    try {
        await s3Client.send(canvasDataUploadCommand);
        await s3Client.send(canvasThumbnailUploadCommand);
    } catch (error) {
        console.log("s3 upload failure: " + error);
        await dataClient.graphql({
            query: deleteCanvases,
            variables: {
                input: {
                    ownerUsername: ownerUsername,
                    canvasId: newCanvasId
                }
            }
        });
        await dataClient.graphql({
            query: deleteCanvasSocialStats,
            variables: {
                input: {
                    ownerUsername: ownerUsername,
                    canvasId: newCanvasId
                }
            }
        });
        return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - Internal Server Error." };
    }

    return { isCanvasSaved: true, canvasId: newCanvasId, errorMessage: null };
};