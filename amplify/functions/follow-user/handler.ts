import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/follow-user';
import { generateClient } from 'aws-amplify/data';
import { AppSyncIdentityCognito } from 'aws-lambda';
import { getUserFollowing, getUsers } from '../../graphql/queries';
import { createUserFollowers, createUserFollowing, deleteUserFollowers, deleteUserFollowing } from '../../graphql/mutations';

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

export const handler: Schema["followUser"]["functionHandler"] = async (event, context) => {
    const { username, userToFollow, unfollow } = event.arguments;

    console.log(`Starting followUser lambda function invocation for ${username} requesting to ${unfollow ? "unfollow" : "follow"} ${userToFollow}.`);

    if (username === userToFollow) {
        return { isUserFollowed: false, errorMessage: "User cannot follow themselves." };
    }

    const ownerCognitoId = (event.identity as AppSyncIdentityCognito).username;
    const { data: getUserData, errors: getUserErrors } = await dataClient.graphql({
        query: getUsers,
        variables: {
            username: username
        },
    });
    const { data: getUserToFollowData, errors: getUserToFollowErrors } = await dataClient.graphql({
        query: getUsers,
        variables: {
            username: userToFollow
        },
    });
    if (getUserErrors || getUserToFollowErrors) {
        console.log(getUserErrors);
        console.log(getUserToFollowErrors);
        return { isUserFollowed: false, errorMessage: "500 - Internal Server Error." };
    }
    if (!getUserData.getUsers || !getUserToFollowData.getUsers) {
        return { isUserFollowed: false, errorMessage: "400 - Requested username or user to follow does not exist." };
    }
    if (!getUserData.getUsers.cognitoId || !getUserToFollowData.getUsers.cognitoId) {
        return { isUserFollowed: false, errorMessage: "500 - User cognitoId unavailable." };
    }
    if (getUserData.getUsers.cognitoId !== ownerCognitoId) {
        return {
            isUserFollowed: false,
            errorMessage: "400 - Authenticated user does not match requested username."
        };
    }

    const { data: getUserFollowingData, errors: getUserFollowingErrors } = await dataClient.graphql({
        query: getUserFollowing,
        variables: {
            username: username,
            following: userToFollow
        }
    });
    if (getUserFollowingErrors) {
        console.log(getUserFollowingErrors);
        return { isUserFollowed: false, errorMessage: "500 - Internal Server Error." };
    }

    if (unfollow) {
        if (!getUserFollowingData.getUserFollowing) {
            return { isUserFollowed: true, errorMessage: null };
        }
        const { errors: deleteUserFollowingErrors } = await dataClient.graphql({
            query: deleteUserFollowing,
            variables: {
                input: {
                    username: username,
                    following: userToFollow
                }
            }
        });
        if (deleteUserFollowingErrors) {
            console.log(deleteUserFollowingErrors);
            return { isUserFollowed: false, errorMessage: "500 - Internal Server Error." }
        }
        const { errors: deleteUserFollowersErrors } = await dataClient.graphql({
            query: deleteUserFollowers,
            variables: {
                input: {
                    username: userToFollow,
                    follower: username,
                }
            }
        });
        if (deleteUserFollowersErrors) {
            console.log(deleteUserFollowersErrors);
            await dataClient.graphql({
                query: createUserFollowing,
                variables: {
                    input: {
                        username: username,
                        cognitoId: `${ownerCognitoId}::${ownerCognitoId}`,
                        following: userToFollow,
                        followDate: getUserFollowingData.getUserFollowing.followDate
                    }
                }
            });
            return { isUserFollowed: false, errorMessage: "500 - Internal Server Error." }
        }

        return { isUserFollowed: true, errorMessage: null };
    } else {
        if (getUserFollowingData.getUserFollowing) {
            return { isUserFollowed: true, errorMessage: null };
        }
        const followDate = new Date().toISOString();
        const { errors: createUserFollowingErrors } = await dataClient.graphql({
            query: createUserFollowing,
            variables: {
                input: {
                    username: username,
                    cognitoId: `${ownerCognitoId}::${ownerCognitoId}`,
                    following: userToFollow,
                    followDate: followDate
                }
            }
        });
        if (createUserFollowingErrors) {
            console.log(createUserFollowingErrors);
            return { isUserFollowed: false, errorMessage: "500 - Internal Server Error." }
        }
        const userToFollowCognitoId = getUserToFollowData.getUsers.cognitoId
        const { errors: createUserFollowersErrors } = await dataClient.graphql({
            query: createUserFollowers,
            variables: {
                input: {
                    username: userToFollow,
                    cognitoId: `${userToFollowCognitoId}::${userToFollowCognitoId}`,
                    follower: username,
                    followDate: followDate
                }
            }
        });
        if (createUserFollowersErrors) {
            console.log(createUserFollowersErrors);
            await dataClient.graphql({
                query: deleteUserFollowing,
                variables: {
                    input: {
                        username: username,
                        following: userToFollow
                    }
                }
            });
            return { isUserFollowed: false, errorMessage: "500 - Internal Server Error." }
        }

        return { isUserFollowed: true, errorMessage: null };
    }
};