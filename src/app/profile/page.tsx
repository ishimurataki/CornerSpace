"use server";

import { redirect } from "next/navigation";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import ProfileSettings from "./profile-settings";
import { getBioServer } from "@/backend-lib/actions";

export default async function ProfilePage() {
    const user = await fetchUserAttributesServer();
    const signedIn = user != undefined;
    const username = user?.preferred_username;

    if (!signedIn) {
        redirect('signin');
    }
    if (!username || !user.email) {
        return (<div className="flex flex-col justify-center items-center mt-10">
            <div className="text-2xl">500: Server error.</div>
        </div>);
    }

    const bioData = await getBioServer(username);

    return (
        <ProfileSettings username={username} email={user.email} bio={bioData.bio} />
    );
}