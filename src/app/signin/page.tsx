"use server";

import SignOutButton from "@/components/sign-out-button";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import SignInUpAggregate from "./signinup-aggregate";
import { redirect } from "next/navigation";

export default async function SignInTestPage() {
    const user = await fetchUserAttributesServer();
    const signedIn = user != undefined;

    if (signedIn) {
        redirect('studio');
    }

    return (
        <div className="flex flex-col gap-4 py-10 h-screen justify-center items-center bg-green-50">
            <SignInUpAggregate />
        </div >
    )
}