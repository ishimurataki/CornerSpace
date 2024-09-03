import { Amplify } from 'aws-amplify';
import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/get-user-email';
import { generateClient } from 'aws-amplify/data';
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

export const handler: Schema["getUserEmail"]["functionHandler"] = async (event, context) => {
    const { username } = event.arguments;

    console.log(`Starting getUserEmail lambda function invocation for ${username}.`);

    const { data: getUsersData, errors: getUsersErrors } = await dataClient.graphql({
        query: getUsers,
        variables: {
            username: username
        }
    });
    if (getUsersErrors || !getUsersData.getUsers) {
        console.log(getUsersErrors);
        return { isEmailReturned: false, email: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!getUsersData.getUsers.emailVisible) {
        return { isEmailReturned: false, email: null, errorMessage: "400 - Email is not publically available." };
    }

    const email = getUsersData.getUsers.email;

    return { isEmailReturned: true, email, errorMessage: null };
};