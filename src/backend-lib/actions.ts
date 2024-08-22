"use server";

import { type Schema } from "@/../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data'
import outputs from "@/../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { AuthError, confirmSignUp, signUp } from "aws-amplify/auth";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import { CanvasCardData, CanvasData, CanvasDataSave } from "./data";
import { hexToRgb, rgbToHex, stringToVec3 } from "@/utils/functions";
import { unstable_noStore } from "next/cache";
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { cookies } from 'next/headers';
import { listCanvasesDigests } from "@/../amplify/graphql/queries"
import { ModelSortDirection } from "../../amplify/graphql/API";

Amplify.configure(outputs, { ssr: true });

const guestClient = generateClient<Schema>();
const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies
});

const CANVAS_LIST_LIMIT = 10;

export async function doesUserExist(username: string): Promise<boolean> {
    if (!username) return false;
    const { errors, data: user } = await guestClient.models.Users.get(
        { username },
        {
            selectionSet: ['username'],
            authMode: "identityPool"
        });
    if (errors) {
        console.log(errors);
        throw (new Error("500 - Internal Server Error."));
    }
    return !!user;
}

export async function signUpServer(username: string, email: string, password: string)
    : Promise<{ isSignedUp: boolean, userId: string | null, errorMessage: string | null }> {
    const usernameTaken = await doesUserExist(username);
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
        if (isSignUpComplete) {
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

function validateCanvasData(canvasData: CanvasDataSave): { valid: boolean, errorMessage: string | null } {

    // TODO: complete this validation function
    if (canvasData.dimension < 10 || canvasData.dimension > 100) {
        return { valid: false, errorMessage: "Canvas must have side dimension at least 10 and at most 100." }
    }
    canvasData.backgroundColor[0] = Math.max(0.0, Math.min(1.0, canvasData.backgroundColor[0]));
    canvasData.backgroundColor[1] = Math.max(0.0, Math.min(1.0, canvasData.backgroundColor[1]));
    canvasData.backgroundColor[2] = Math.max(0.0, Math.min(1.0, canvasData.backgroundColor[2]));

    return { valid: true, errorMessage: null };
}

export async function loadCanvasCardDataServer(canvasId: string):
    Promise<{ isCanvasLoaded: boolean, canvasCardData: CanvasCardData | null, errorMessage: string | null }> {

    let dataReturned = null;
    let errorsReturned = null;

    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        const { data, errors } = await guestClient.queries.getCanvasCard(
            { canvasId: canvasId },
            { authMode: "identityPool" }
        );
        dataReturned = data;
        errorsReturned = errors;
    } else {
        const { data, errors } = await cookieBasedClient.queries.getCanvasCard(
            { canvasId: canvasId },
            { authMode: "userPool" }
        );
        dataReturned = data;
        errorsReturned = errors;
    }

    if (errorsReturned || !dataReturned) {
        console.log(errorsReturned);
        return { isCanvasLoaded: false, canvasCardData: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!dataReturned.isCanvasCardReturned) {
        return {
            isCanvasLoaded: false, canvasCardData: null,
            errorMessage: dataReturned.errorMessage ? dataReturned.errorMessage : null
        };
    }
    return { isCanvasLoaded: true, canvasCardData: dataReturned.canvasCard ? dataReturned.canvasCard : null, errorMessage: null };
}


export async function loadCanvasServer(canvasId: string):
    Promise<{ isCanvasLoaded: boolean, canvasData: CanvasData | null, errorMessage: string | null }> {

    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;

    let dataReturned = null;
    let errorsReturned = null;
    if (signedIn) {
        const { data, errors } = await cookieBasedClient.queries.getCanvasData(
            { canvasId: canvasId },
            { authMode: "userPool" }
        );
        dataReturned = data;
        errorsReturned = errors;
    } else {
        const { data, errors } = await guestClient.queries.getCanvasData(
            { canvasId: canvasId },
            { authMode: "identityPool" }
        );
        dataReturned = data;
        errorsReturned = errors;
    }

    if (errorsReturned || !dataReturned) {
        console.log(errorsReturned);
        return { isCanvasLoaded: false, canvasData: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!dataReturned.isCanvasDataReturned || !dataReturned.canvasData) {
        return {
            isCanvasLoaded: false, canvasData: null,
            errorMessage: dataReturned.errorMessage ? dataReturned.errorMessage : null
        };
    }

    const canvasDataJson = JSON.parse(dataReturned.canvasData.canvasData);
    const voxels = canvasDataJson.voxels.map((voxelString: string) => {
        const voxelStringParts = voxelString.split(":");
        const voxelCoords = stringToVec3(voxelStringParts[0]);
        return {
            x: voxelCoords[0],
            y: voxelCoords[1],
            z: voxelCoords[2],
            cubeColor: hexToRgb(voxelStringParts[1]),
            cubeMaterial: Number(voxelStringParts[2])
        };
    });

    const canvasData: CanvasData = {
        name: dataReturned.canvasData.name,
        owner: dataReturned.canvasData.ownerUsername,
        description: dataReturned.canvasData.description ? dataReturned.canvasData.description : "",
        publicity: dataReturned.canvasData.publicity,
        likeCount: dataReturned.canvasData.likeCount,
        viewCount: dataReturned.canvasData.viewCount,
        version: canvasDataJson.version,
        dimension: canvasDataJson.dimension,
        pointLightPosition: stringToVec3(canvasDataJson.pointLightPosition),
        backgroundColor: hexToRgb(canvasDataJson.backgroundColor),
        ambientStrength: canvasDataJson.ambientStrength,
        pointLightStrength: canvasDataJson.pointLightStrength,
        viewerRef: canvasDataJson.viewerRef,
        viewerTheta: canvasDataJson.viewerTheta,
        viewerPhi: canvasDataJson.viewerPhi,
        viewerR: canvasDataJson.viewerR,
        voxels: voxels
    };

    return { isCanvasLoaded: true, canvasData: canvasData, errorMessage: null };
}

export async function saveCanvasServer(canvasData: CanvasDataSave, canvasId: string | null = null):
    Promise<{ isCanvasSaved: boolean, canvasId: string | null, errorMessage: string | null }> {
    unstable_noStore();

    const isNewCanvas = !canvasId;

    // Confirm that user is signed in
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { isCanvasSaved: false, canvasId, errorMessage: "User not authenticated." }
    }

    // Confirm that canvas data passed is valid
    const { valid, errorMessage } = validateCanvasData(canvasData);
    if (!valid) {
        return { isCanvasSaved: false, canvasId, errorMessage };
    }

    let voxelsString: string[] = JSON.parse(canvasData.voxels);
    const canvasDataString = JSON.stringify({
        "version": canvasData.version,
        "dimension": canvasData.dimension,
        "pointLightPosition": canvasData.pointLightPosition.toString(),
        "backgroundColor": rgbToHex(canvasData.backgroundColor),
        "ambientStrength": canvasData.ambientStrength,
        "pointLightStrength": canvasData.pointLightStrength,
        "viewerRef": canvasData.viewerRef,
        "viewerTheta": canvasData.viewerTheta,
        "viewerPhi": canvasData.viewerPhi,
        "viewerR": canvasData.viewerR,
        "voxels": voxelsString
    });
    const publicity = canvasData.publicity;

    const result = await cookieBasedClient.mutations.createCanvasForUser(
        {
            ownerUsername: username,
            canvasId: canvasId,
            name: canvasData.name,
            description: canvasData.description,
            publicity: publicity,
            canvasData: canvasDataString,
            canvasThumbail: canvasData.canvasThumbnail,
        },
        {
            authMode: "userPool"
        }
    );

    if (result.errors || !result.data) {
        console.log(result.errors);
        return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - Internal Server Error." }
    }
    return {
        isCanvasSaved: result.data.isCanvasSaved,
        canvasId: result.data.canvasId ? result.data.canvasId : null,
        errorMessage: result.data.errorMessage ? result.data.errorMessage : null
    };
}

export async function testServer() {

    console.log("here test server");

    const { data, errors } = await cookieBasedClient.models.Canvases.get(
        { ownerUsername: "ishimurataki", canvasId: "3447b220-6e34-4996-99bb-eba4b6462469" },
        { authMode: "userPool" }
    )
    if (errors) {
        console.log(errors);
    }
    if (data) {
        console.log(data);
    }
}

export async function getPublicCanvasIdsForUserServer(username: string, nextToken: string | null = null):
    Promise<{
        areCanvasIdsLoaded: boolean, username: string | null,
        canvasIds: string[] | null, nextToken: string | null, errorMessage: string | null
    }> {
    const { data, errors } = await guestClient.queries.getPublicCanvasIdsForUser(
        { ownerUsername: username, nextToken: nextToken },
        { authMode: "identityPool" }
    );
    if (errors || !data) {
        console.log(errors);
        return { areCanvasIdsLoaded: false, username: null, canvasIds: null, nextToken: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!data.areCanvasIdsReturned) {
        return { areCanvasIdsLoaded: false, username: null, canvasIds: null, nextToken: null, errorMessage: data.errorMessage ? data.errorMessage : null };
    }
    return {
        areCanvasIdsLoaded: true, username: username, canvasIds: data.canvasIds ? data.canvasIds : null,
        nextToken: data.nextToken ? data.nextToken : null, errorMessage: null
    };
}

export async function getCanvasIdsForSignedInUserServer(nextToken: string | null = null):
    Promise<{
        areCanvasIdsLoaded: boolean, username: string | null,
        canvasIds: string[] | null, nextToken: string | null, errorMessage: string | null
    }> {

    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { areCanvasIdsLoaded: false, username: null, canvasIds: null, nextToken: null, errorMessage: "User not authenticated." };
    }

    const { data, errors } = await cookieBasedClient.queries.getAllCanvasIdsForAuthenticatedUser(
        { ownerUsername: username, nextToken: nextToken },
        { authMode: "userPool" }
    );
    if (errors || !data) {
        console.log(errors);
        return { areCanvasIdsLoaded: false, username: null, canvasIds: null, nextToken: null, errorMessage: "500 - Internal Server Error." };
    }
    if (!data.areCanvasIdsReturned) {
        return { areCanvasIdsLoaded: false, username: null, canvasIds: null, nextToken: null, errorMessage: data.errorMessage ? data.errorMessage : null };
    }
    return {
        areCanvasIdsLoaded: true, username: username, canvasIds: data.canvasIds ? data.canvasIds : null,
        nextToken: data.nextToken ? data.nextToken : null, errorMessage: null
    };
}

export async function deleteCanvasServer(canvasId: string):
    Promise<{
        isCanvasDeleted: boolean, errorMessage: string | null
    }> {

    // Confirm that user is signed in
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { isCanvasDeleted: false, errorMessage: "User not authenticated." }
    }

    const result = await cookieBasedClient.mutations.deleteCanvasForUser(
        { canvasId: canvasId },
        { authMode: "userPool" }
    );

    if (result.errors || !result.data) {
        console.log(result.errors);
        return { isCanvasDeleted: false, errorMessage: "500 - Internal Server Error." }
    }
    return {
        isCanvasDeleted: result.data.isCanvasDeleted,
        errorMessage: result.data.errorMessage ? result.data.errorMessage : null
    };
}

export async function getNumberOfCanvasesForSignedInUserServer():
    Promise<{
        numberOfCanvases: number | null, errorMessage: string | null
    }> {

    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { numberOfCanvases: null, errorMessage: "User not authenticated." }
    }

    const { errors, data: user } = await cookieBasedClient.models.Users.get(
        { username },
        {
            selectionSet: ['numberOfCanvases'],
            authMode: "userPool"
        }
    );
    if (user?.numberOfCanvases) {
        return { numberOfCanvases: user.numberOfCanvases, errorMessage: null };
    }
    if (errors) {
        console.log(errors);
    }
    return { numberOfCanvases: null, errorMessage: "500 - Internal Server Error." }
}

export async function likeCanvasForSignedInUserServer(canvasId: string, removeLike: boolean = false):
    Promise<{
        isCanvasLiked: boolean | null, errorMessage: string | null
    }> {
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        console.log("User not authenticated.");
        return { isCanvasLiked: null, errorMessage: "User not authenticated." }
    }

    const result = await cookieBasedClient.mutations.likeCanvasForUser(
        { username, canvasId, removeLike },
        { authMode: "userPool" }
    );

    if (result.errors || !result.data) {
        console.log(result.errors);
        return { isCanvasLiked: false, errorMessage: "500 - Internal Server Error." }
    }
    return {
        isCanvasLiked: result.data.isCanvasLiked,
        errorMessage: result.data.errorMessage ? result.data.errorMessage : null
    };

}

export async function isCanvasLikedForSignedInUserServer(canvasId: string):
    Promise<{
        isCanvasLiked: boolean | null, errorMessage: string | null
    }> {
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { isCanvasLiked: null, errorMessage: "User not authenticated." }
    }

    const { data: listCanvasLikesData, errors: listCanvasLikesErrors } = await cookieBasedClient.models.CanvasLikes.listCanvasLikesByCanvasIdAndUsername(
        { canvasId, username: { eq: username } },
        { authMode: "userPool" }
    )
    if (listCanvasLikesErrors) {
        console.log(listCanvasLikesErrors);
        return { isCanvasLiked: null, errorMessage: "500 - Internal Server Error." }
    }
    return { isCanvasLiked: listCanvasLikesData.length > 0, errorMessage: null };
}

export async function getLikedCanvasesForSignedInUserServer(nextToken: string | null = null):
    Promise<{
        areCanvasIdsLoaded: boolean, canvasIds: string[] | null, nextToken: string | null, errorMessage: string | null
    }> {
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { areCanvasIdsLoaded: false, canvasIds: null, nextToken: null, errorMessage: "User not authenticated." }
    }

    const { data: listLikedCanvasesData, errors: listLikedCanvasesErrors, nextToken: nextTokenToReturn } = await cookieBasedClient.models.CanvasLikes.list(
        { username: username, sortDirection: "DESC", authMode: "userPool", limit: CANVAS_LIST_LIMIT, nextToken },
    );

    if (listLikedCanvasesErrors) {
        console.log(listLikedCanvasesErrors)
        return { areCanvasIdsLoaded: false, canvasIds: null, nextToken: null, errorMessage: "500 - Internal Server Error." }
    }

    const likedCanvases = listLikedCanvasesData.map((likedCanvas) => {
        return likedCanvas.canvasId;
    })

    return {
        areCanvasIdsLoaded: true, canvasIds: likedCanvases,
        nextToken: nextTokenToReturn ? nextTokenToReturn : null, errorMessage: null
    };
}

export async function followUserForSignedInUserServer(userToFollow: string, unfollow: boolean = false):
    Promise<{
        isUserFollowed: boolean | null, errorMessage: string | null
    }> {
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        console.log("User not authenticated.");
        return { isUserFollowed: null, errorMessage: "User not authenticated." }
    }

    const result = await cookieBasedClient.mutations.followUser(
        { username, userToFollow, unfollow },
        { authMode: "userPool" }
    );

    if (result.errors || !result.data) {
        console.log(result.errors);
        return { isUserFollowed: false, errorMessage: "500 - Internal Server Error." }
    }

    return {
        isUserFollowed: result.data.isUserFollowed,
        errorMessage: result.data.errorMessage ? result.data.errorMessage : null
    };
}

export async function isUserFollowedForSignedInUserServer(userToFollow: string):
    Promise<{
        isUserFollowed: boolean | null, errorMessage: string | null
    }> {
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { isUserFollowed: null, errorMessage: "User not authenticated." };
    }

    if (username == userToFollow) {
        return { isUserFollowed: false, errorMessage: null };
    }

    const { data: getUserFollowingData, errors: getUserFollowingErrors } = await cookieBasedClient.models.UserFollowing.get(
        { username: username, following: userToFollow },
        { authMode: "userPool" }
    );

    if (getUserFollowingErrors) {
        console.log(getUserFollowingErrors);
        return { isUserFollowed: null, errorMessage: "500 - Internal Server Error." }
    }
    return { isUserFollowed: !!getUserFollowingData, errorMessage: null };
}

export async function getUserFollowingForSignedInUserServer():
    Promise<{
        areUsersReturned: boolean, users: { username: string, followDate: string }[] | null, errorMessage: string | null
    }> {
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { areUsersReturned: false, users: null, errorMessage: "User not authenticated." }
    }

    const { data: listUserFollowingData, errors: listUserFollowingErrors } = await cookieBasedClient.models.UserFollowing.list(
        { username: username, authMode: "userPool" },
    );

    if (listUserFollowingErrors) {
        console.log(listUserFollowingErrors)
        return { areUsersReturned: false, users: null, errorMessage: "500 - Internal Server Error." }
    }

    const users = listUserFollowingData.map((user) => {
        return { username: user.following, followDate: user.followDate }
    });

    return { areUsersReturned: true, users: users, errorMessage: null };
}

export async function getUserFollowersForSignedInUserServer():
    Promise<{
        areUsersReturned: boolean, users: { username: string, followDate: string }[] | null, errorMessage: string | null
    }> {
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { areUsersReturned: false, users: null, errorMessage: "User not authenticated." }
    }

    const { data: listUserFollowersData, errors: listUserFollowersErrors } = await cookieBasedClient.models.UserFollowers.list(
        { username: username, authMode: "userPool" },
    );

    if (listUserFollowersErrors) {
        console.log(listUserFollowersErrors);
        return { areUsersReturned: false, users: null, errorMessage: "500 - Internal Server Error." };
    }

    const users = listUserFollowersData.map((user) => {
        return { username: user.follower, followDate: user.followDate }
    });

    return { areUsersReturned: true, users: users, errorMessage: null };
}

export async function getPopularCanvasesServer(nextToken: string | null = null):
    Promise<{
        areCanvasIdsLoaded: boolean, canvasIds: string[] | null, nextToken: string | null, errorMessage: string | null
    }> {

    const { data: listPopularCanvasesData, errors: listPopularCanvasesErrors } = await guestClient.graphql({
        query: listCanvasesDigests,
        variables: {
            partitionKey: "canvases#popular",
            sortDirection: ModelSortDirection.DESC,
            limit: CANVAS_LIST_LIMIT,
            nextToken: nextToken
        },
        authMode: "identityPool"
    });

    if (listPopularCanvasesErrors) {
        console.log(listPopularCanvasesErrors);
        return { areCanvasIdsLoaded: false, canvasIds: null, nextToken: null, errorMessage: "500 - Internal Server Error." };
    }

    let nextTokenToReturn = listPopularCanvasesData.listCanvasesDigests.nextToken;
    nextTokenToReturn ??= null;

    const popularCanvases = listPopularCanvasesData.listCanvasesDigests.items.map((canvas) => canvas.canvasId)
        .filter((canvasId) => canvasId !== null && canvasId !== undefined);

    return { areCanvasIdsLoaded: true, canvasIds: popularCanvases, nextToken: nextTokenToReturn, errorMessage: null };
}

export async function getNewCanvasesServer(nextToken: string | null = null):
    Promise<{
        areCanvasIdsLoaded: boolean, canvasIds: string[] | null, nextToken: string | null, errorMessage: string | null
    }> {

    const { data: listPopularCanvasesData, errors: listPopularCanvasesErrors } = await guestClient.graphql({
        query: listCanvasesDigests,
        variables: {
            partitionKey: "canvases#new",
            sortDirection: ModelSortDirection.DESC,
            limit: CANVAS_LIST_LIMIT,
            nextToken: nextToken
        },
        authMode: "identityPool"
    });

    if (listPopularCanvasesErrors) {
        console.log(listPopularCanvasesErrors);
        return { areCanvasIdsLoaded: false, canvasIds: null, nextToken: null, errorMessage: "500 - Internal Server Error." };
    }

    let nextTokenToReturn = listPopularCanvasesData.listCanvasesDigests.nextToken;
    nextTokenToReturn ??= null;

    const popularCanvases = listPopularCanvasesData.listCanvasesDigests.items.map((canvas) => canvas.canvasId)
        .filter((canvasId) => canvasId !== null && canvasId !== undefined);

    return { areCanvasIdsLoaded: true, canvasIds: popularCanvases, nextToken: nextTokenToReturn, errorMessage: null };
}