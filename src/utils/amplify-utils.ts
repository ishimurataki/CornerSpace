"use server";

// utils/amplify-utils.ts
import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth/server";
import { type Schema } from "@/../../amplify/data/resource";
import outputs from "@/../../amplify_outputs.json";
import { unstable_noStore as noStore } from 'next/cache';
import { AuthError } from "aws-amplify/auth";

export const { runWithAmplifyServerContext } = createServerRunner({
    config: outputs
});

export async function fetchUserAttributesServer() {
    noStore();
    try {
        const currentUserAttributes = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: (contextSpec) => fetchUserAttributes(contextSpec),
        });
        return currentUserAttributes;
    } catch (error) {
        if (error instanceof AuthError) {
            console.log("fetchUserAttributesServer failed, no user is authenticated");
        } else {
            console.log(error);
        }
        return undefined;
    }
}