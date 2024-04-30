'use server';

import { AuthError, signIn } from "aws-amplify/auth";

export async function signInServer(email: string, password: string)
    : Promise<{ isSignedIn: Boolean, errorMessage: string | null }> {
    try {
        const { isSignedIn, nextStep } = await signIn({ username: email, password });
        return { isSignedIn, errorMessage: null };
    } catch (error) {
        console.log(error);
        if (error instanceof AuthError) {
            return { isSignedIn: false, errorMessage: "Invalid credentials." }
        } else {
            return { isSignedIn: false, errorMessage: "Something went wrong." }
        }
    }
}