'use server';

import { fetchUserAttributesServer } from '@/utils/amplify-utils';
import Header from "@/app/header";

export default async function HeaderWrapper() {

    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    return (
        <Header signedIn={signedIn} username={username ? username : null} />
    )
}