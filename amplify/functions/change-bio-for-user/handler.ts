import type { AppSyncIdentityCognito } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/change-bio-for-user';
import { getUsers } from '../../graphql/queries';
import { updateUsers } from '../../graphql/mutations';
import { USER_BIO_MAXIMUM_LENGTH } from '../../constants';

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

const validateChangeBioForUserInput = (newBio: string) => {
    if (newBio.length > USER_BIO_MAXIMUM_LENGTH) {
        throw new Error(`Bio name must be at most ${USER_BIO_MAXIMUM_LENGTH} characters long.`);
    }
}

export const handler: Schema["changeBioForUser"]["functionHandler"] = async (event, context) => {
    const { username, newBio } = event.arguments;

    console.log(`Starting changeBioForUser lambda function invocation for ${username}.`);

    try {
        if (newBio) validateChangeBioForUserInput(newBio);
    } catch (err) {
        if (err instanceof Error) {
            return { isBioChanged: false, errorMessage: `400 - Invalid argument exception: ${err.message}` };
        }
    }

    const ownerCognitoId = (event.identity as AppSyncIdentityCognito).username;
    const { data: getUserData, errors: getUserErrors } = await dataClient.graphql({
        query: getUsers,
        variables: {
            username: username
        },
    });
    if (getUserErrors || !getUserData.getUsers) {
        console.log(getUserErrors);
        return { isBioChanged: false, errorMessage: "500 - Internal Server Error." };
    }
    if (!getUserData.getUsers.cognitoId) {
        return { isBioChanged: false, errorMessage: "500 - User cognitoId unavailable." };
    }
    if (getUserData.getUsers.cognitoId !== ownerCognitoId) {
        return {
            isBioChanged: false,
            errorMessage: "400 - Authenticated user does not match requested username."
        };
    }

    const { errors: updateUserErrors } = await dataClient.graphql({
        query: updateUsers,
        variables: {
            input: {
                username: username,
                biography: newBio
            },
        }
    });

    if (updateUserErrors) {
        console.log(updateUserErrors);
        return { isBioChanged: false, errorMessage: "500 - Internal Server Error." };
    }

    return { isBioChanged: true, errorMessage: null };
};