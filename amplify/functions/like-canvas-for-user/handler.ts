import type { AppSyncIdentityCognito } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/like-canvas-for-user';
import {
    createCanvasLikes, deleteCanvasLikes, updateCanvasSocialStats
} from '../../graphql/mutations';
import {
    getCanvasSocialStats, getUsers, listCanvasesByCanvasId, listCanvasLikesByCanvasIdAndUsername
} from '../../graphql/queries';

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

export const handler: Schema["likeCanvasForUser"]["functionHandler"] = async (event, context) => {
    const { username, canvasId, removeLike } = event.arguments;

    console.log(`Starting likeCanvasForUser lambda function invocation for user ${username} and canvasId ${canvasId}.`)

    const ownerCognitoId = (event.identity as AppSyncIdentityCognito).username;

    const { data: getUsersData, errors: getUsersErrors } = await client.graphql({
        query: getUsers,
        variables: {
            username: username
        }
    });

    if (getUsersErrors) {
        console.log(getUsersErrors);
        return { isCanvasLiked: false, errorMessage: "500 - Internal Server Error." };
    }
    if (!getUsersData.getUsers || !getUsersData.getUsers.cognitoId) {
        return {
            isCanvasLiked: false,
            errorMessage: `Requested user ${username} not found.`
        };
    }

    const userAuthenticated = getUsersData.getUsers.cognitoId === ownerCognitoId;

    if (!userAuthenticated) {
        return {
            isCanvasLiked: false,
            errorMessage: `User is not authenticated.`
        };
    }

    const { data: listCanvasData, errors: listCanvasErrors } = await client.graphql({
        query: listCanvasesByCanvasId,
        variables: {
            canvasId: canvasId
        },
    });
    if (listCanvasErrors) {
        console.log(listCanvasErrors);
        return { isCanvasLiked: false, errorMessage: "500 - Internal Server Error." };
    }
    if (!listCanvasData.listCanvasesByCanvasId || listCanvasData.listCanvasesByCanvasId.items.length === 0) {
        return { isCanvasLiked: false, errorMessage: `Requested canvasId ${canvasId} not found.` };
    }

    const canvasMetaData = listCanvasData.listCanvasesByCanvasId.items[0];

    const userAuthorized = canvasMetaData.publicity === "PUBLIC" || canvasMetaData.ownerCognitoId === ownerCognitoId;

    if (!userAuthorized) {
        return {
            isCanvasLiked: false,
            errorMessage: `Liking canvasId ${canvasId} as user ${username} is not authorized.`
        };
    }

    const { data: listCanvasLikesData, errors: listCanvasLikesErrors } = await client.graphql({
        query: listCanvasLikesByCanvasIdAndUsername,
        variables: {
            canvasId: canvasId,
            username: {
                eq: username
            }
        }
    });
    if (listCanvasLikesErrors) {
        console.log(listCanvasLikesErrors);
        return { isCanvasLiked: false, errorMessage: "500 - Internal Server Error." };
    }

    if (!listCanvasLikesData.listCanvasLikesByCanvasIdAndUsername ||
        listCanvasLikesData.listCanvasLikesByCanvasIdAndUsername.items.length === 0) {

        if (removeLike) {
            return { isCanvasLiked: false, errorMessage: "Cannot remove like from an unliked canvas." };
        }

        const likeId = Math.round(Date.now() / 1000);
        const { errors: createCanvasLikesDataErrors } = await client.graphql({
            query: createCanvasLikes,
            variables: {
                input: {
                    username: username,
                    cognitoId: `${ownerCognitoId}::${ownerCognitoId}`,
                    likeId: likeId,
                    canvasId: canvasId,
                }
            }
        });
        if (createCanvasLikesDataErrors) {
            console.log(createCanvasLikesDataErrors);
            return { isCanvasLiked: false, errorMessage: "500 - Internal Server Error." };
        }
    } else {
        if (!removeLike) {
            return { isCanvasLiked: false, errorMessage: "Cannot like an already liked canvas." };
        }

        const canvasLikeData = listCanvasLikesData.listCanvasLikesByCanvasIdAndUsername.items[0];
        const { errors: deleteCanvasLikesDataErrors } = await client.graphql({
            query: deleteCanvasLikes,
            variables: {
                input: {
                    username: username,
                    likeId: canvasLikeData.likeId
                }
            }
        });
        if (deleteCanvasLikesDataErrors) {
            console.log(deleteCanvasLikesDataErrors);
            return { isCanvasLiked: false, errorMessage: "500 - Internal Server Error." };
        }
    }
    const { data: getCanvasSocialStatsData, errors: getCanvasSocialStatsErrors } = await client.graphql({
        query: getCanvasSocialStats,
        variables: {
            ownerUsername: canvasMetaData.ownerUsername,
            canvasId: canvasId
        },
    });
    if (getCanvasSocialStatsErrors) {
        console.log(getCanvasSocialStatsErrors);
        return { isCanvasLiked: false, errorMessage: "500 - Internal Server Error." };
    }
    if (!getCanvasSocialStatsData.getCanvasSocialStats) {
        return {
            isCanvasLiked: false, errorMessage: `Social stats for requested canvasId ${canvasId} not found.`
        };
    }
    const canvasSocialStats = getCanvasSocialStatsData.getCanvasSocialStats;
    canvasSocialStats.likeCount += removeLike ? -1 : 1;
    await client.graphql({
        query: updateCanvasSocialStats,
        variables: {
            input: {
                ownerUsername: canvasMetaData.ownerUsername,
                canvasId: canvasId,
                likeCount: canvasSocialStats.likeCount
            }
        }
    });
    console.log("Finishing likeCanvasForUser lambda function.")
    return { isCanvasLiked: true, errorMessage: null };
};