"use server";

import { type Schema } from "@/../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data'
import config from "@/../../amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { AuthError, confirmSignUp, signUp } from "aws-amplify/auth";

Amplify.configure(config, { ssr: true });

const client = generateClient<Schema>();

type User = {
    username: string,
    numberOfCanvases: number,
    createdAt: string,
    updatedAt: string
}

async function isUsernameTaken(username: string) {
    const { errors, data: user } = await client.models.Users.get({ username });
    if (errors) {
        console.log(errors);
        throw (new Error("500 - Internal Server Error."));
    }
    return Object.keys(user as User).length > 0;
}

export async function createUser(username: string) {
    const { errors, data: newUser } = await client.models.Users.create({
        username,
    });
    if (!errors) {
        console.log(`Created user ${(newUser as User).username} in Users DDB table.`);
        return true;
    }
    console.log(errors);
    return false;
}

export async function signUpServer(username: string, email: string, password: string)
    : Promise<{ isSignedUp: boolean, userId: string | null, errorMessage: string | null }> {
    const usernameTaken = await isUsernameTaken(username);
    if (usernameTaken) {
        return { isSignedUp: false, userId: null, errorMessage: "Username already taken." };
    }
    try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    preferred_username: username,
                    email: email
                },
                autoSignIn: true
            }
        });
        if (userId) {
            return { isSignedUp: true, userId, errorMessage: null };
        }
        return { isSignedUp: false, userId: null, errorMessage: "500 - Internal Server Error." }
    } catch (error) {
        if (error instanceof AuthError) {
            return { isSignedUp: false, userId: null, errorMessage: error.message };
        } else {
            return { isSignedUp: false, userId: null, errorMessage: "500 - Internal Server Error." };
        }
    }
}

export async function confirmSignUpServer(username: string, userId: string, confirmationCode: string) {
    try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
            username: userId,
            confirmationCode
        });
        if (isSignUpComplete && await createUser(username)) {
            return { isSignedUp: true, errorMessage: null };
        }
        return { isSignedUp: false, errorMessage: "500 - Internal Server Error." }
    } catch (error) {
        if (error instanceof AuthError) {
            return { isSignedUp: false, errorMessage: error.message }
        } else {
            return { isSignedUp: false, errorMessage: "500 - Internal Server Error." }
        }
    }
}