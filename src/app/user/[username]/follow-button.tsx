"use client";

import { followUserForSignedInUserServer, isUserFollowedForSignedInUserServer } from "@/backend-lib/actions";
import { CheckIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";

export default function FollowButton({ userToFollow }: { userToFollow: string }) {

    const [signedIn, setSignedIn] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const checkIfSignedIn = async () => {
            const user = await fetchUserAttributesServer();
            const signedIn = user != undefined;

            if (signedIn && user.preferred_username !== userToFollow) {
                const userFollowed = await isUserFollowedForSignedInUserServer(userToFollow);
                if (userFollowed.isUserFollowed === null) {
                    setSignedIn(false);
                } else {
                    setSignedIn(true);
                    setFollowed(userFollowed.isUserFollowed);
                }
            } else {
                setSignedIn(false);
            }
        }
        checkIfSignedIn();
    }, []);

    if (signedIn) {
        if (followed) {
            return (
                <button className="flex flex-row gap-2 border-2 border-black rounded-full py-1 px-2 
            hover:border-cyan-400 hover:text-cyan-400 hover:bg-black"
                    onMouseEnter={() => { setHovered(true) }}
                    onMouseLeave={() => { setHovered(false) }}
                    onClick={() => {
                        setFollowed(false);
                        followUserForSignedInUserServer(userToFollow, true);
                    }}>
                    <CheckIcon className="h-6 w-6" />
                    {hovered ? <div>Unfollow</div> : ""}
                </button>
            )
        }
        return (
            <button className="flex flex-row gap-2 border-2 border-black rounded-full py-1 px-2 
            hover:border-cyan-400 hover:text-cyan-400 hover:bg-black"
                onMouseEnter={() => { setHovered(true) }}
                onMouseLeave={() => { setHovered(false) }}
                onClick={() => {
                    setFollowed(true);
                    followUserForSignedInUserServer(userToFollow, false);
                }}>
                <UserPlusIcon className="h-6 w-6" />
                {hovered ? <div>Follow</div> : ""}
            </button>
        )
    }
    return;
}