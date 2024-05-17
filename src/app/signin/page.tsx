"use server";

import SignOutButton from "@/components/sign-out-button";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import SignInUpAggregate from "./signinup-aggregate";

export default async function SignInTestPage() {
    const user = await fetchUserAttributesServer();
    const signedIn = user != undefined;

    return (
        <div className="flex flex-col gap-4 py-10 h-screen justify-center items-center bg-green-50">
            {signedIn ?
                <div className="w-2/3 max-w-2xl min-w-fit mx-auto flex flex-row h-100">
                    <div className="w-full bg-green-400 rounded-2xl p-10 flex flex-col gap-2">
                        Hi {user.preferred_username}! Welcome to cubit!
                        <SignOutButton />
                    </div>
                </div> :
                <SignInUpAggregate />
            }
        </div >
    )
}