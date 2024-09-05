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
import { CANVAS_DESCRIPTION_MAXIMUM_LENGTH, CANVAS_DESCRIPTION_MINIMUM_LENGTH, CANVAS_NAME_MAXIMUM_LENGTH, CANVAS_NAME_MINIMUM_LENGTH, CANVAS_PUBLICITY_STATES } from '../../constants';

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

const validateCreateCanvasForUserInput = (name: string, description: string, publicity: string,
    canvasData: string, canvasThumbail: string) => {
    if (name.length < CANVAS_NAME_MINIMUM_LENGTH) {
        throw new Error(`Canvas name must be at least ${CANVAS_NAME_MINIMUM_LENGTH} characters long.`);
    }
    if (name.length > CANVAS_NAME_MAXIMUM_LENGTH) {
        throw new Error(`Canvas name must be at most ${CANVAS_NAME_MAXIMUM_LENGTH} characters long.`);
    }
    if (description.length < CANVAS_DESCRIPTION_MINIMUM_LENGTH) {
        throw new Error(`Canvas description must be at least ${CANVAS_DESCRIPTION_MINIMUM_LENGTH} characters long.`);
    }
    if (description.length > CANVAS_DESCRIPTION_MAXIMUM_LENGTH) {
        throw new Error(`Canvas description must be at most ${CANVAS_DESCRIPTION_MAXIMUM_LENGTH} characters long.`);
    }
    if (!CANVAS_PUBLICITY_STATES.includes(publicity)) {
        throw new Error(`Canvas publicity must be one of the following values: ${CANVAS_PUBLICITY_STATES.toString()}`);
    }

    if (!canvasThumbail.startsWith("data:image/jpeg;base64")) {
        throw new Error('Canvas thumbnail must be an inline base64 jpeg image.')
    }
}

export const handler: Schema["createCanvasForUser"]["functionHandler"] = async (event, context) => {
    const { ownerUsername, canvasId, name, description, publicity, canvasData, canvasThumbail } = event.arguments;

    console.log(`Starting createCanvasForUser lambda function invocation for ${ownerUsername}.`)

    try {
        validateCreateCanvasForUserInput(name, description, publicity, canvasData, canvasThumbail);
    } catch (err) {
        if (err instanceof Error) {
            return { isCanvasSaved: false, canvasId: null, errorMessage: `400 - Invalid argument exception: ${err.message}` };
        }
    }
    const isNewCanvas = !canvasId;
    let newCanvasId: string = canvasId ? canvasId : "";

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

    const { data: listCanvasesData, errors: listCanvasesErrors } = await dataClient.graphql({
        query: listCanvases,
        variables: {
            ownerUsername: ownerUsername
        }
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