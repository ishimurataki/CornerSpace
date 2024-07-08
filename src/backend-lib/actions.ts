"use server";

import { type Schema } from "@/../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data'
import outputs from "@/../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { AuthError, confirmSignUp, fetchAuthSession, signUp } from "aws-amplify/auth";
import { downloadData, uploadData } from 'aws-amplify/storage';
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import { CanvasData, CanvasDataSave, Publicity } from "./data";
import { v4 as uuidv4 } from 'uuid';
import { hexToRgb, rgbToHex, stringToVec3 } from "@/utils/functions";
import { unstable_noStore } from "next/cache";

Amplify.configure(outputs, { ssr: true });

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

async function createUser(username: string) {
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

export async function loadCanvasServer(canvasId: string):
    Promise<{ isCanvasLoaded: boolean, canvasData: CanvasData | null, errorMessage: string | null }> {

    const { data: canvasData, errors: getCanvasErrors } =
        await client.models.Canvases.listCanvasesByCanvasId({ canvasId: canvasId });

    if (getCanvasErrors) {
        return { isCanvasLoaded: false, canvasData: null, errorMessage: "500 - Internal Server Error." }
    }
    if (canvasData.length == 0) {
        return { isCanvasLoaded: false, canvasData: null, errorMessage: "Invalid canvasId." }
    }
    const canvas = canvasData[0];
    const username = canvas.owner;

    try {
        const canvasDataDownloadResult = await downloadData({
            path: `canvases/${username}/${canvasId}`,
        }).result;
        const canvasDataJson = await canvasDataDownloadResult.body.json();

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
            name: canvas.name,
            owner: canvas.owner,
            description: canvas.description ? canvas.description : "",
            publicity: canvas.publicity == "PRIVATE" ? Publicity.Private : Publicity.Public,
            version: canvasDataJson.version,
            dimension: canvasDataJson.dimension,
            pointLightPosition: stringToVec3(canvasDataJson.pointLightPosition),
            backgroundColor: hexToRgb(canvasDataJson.backgroundColor),
            ambientStrength: canvasDataJson.ambientStrength,
            pointLightStrength: canvasDataJson.pointLightStrength,
            voxels: voxels,
            canvasThumbnail: canvasDataJson.canvasThumbnail,
        };

        return { isCanvasLoaded: true, canvasData: canvasData, errorMessage: null }
    } catch (e) {
        console.log(e);
        return { isCanvasLoaded: false, canvasData: null, errorMessage: "500 - Internal Server Error." }
    }
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

    // Obtain correct canvasId
    const { data: canvasesData, errors: getCanvasForUserErrors } =
        await client.queries.getCanvasesForUser({ user: username });
    if (getCanvasForUserErrors || canvasesData == undefined || canvasesData == null) {
        console.log(getCanvasForUserErrors);
        return { isCanvasSaved: false, canvasId, errorMessage: "500 - Internal Server Error." };
    }

    const canvases = Object.values(canvasesData);
    if (canvasId && !canvases.some((canvas) => canvas?.canvasId == canvasId)) {
        return { isCanvasSaved: false, canvasId, errorMessage: "Invalid canvas ID." }
    } else if (!canvasId) {
        const { data: user, errors: usersGetErrors } = await client.models.Users.get({ username });
        if (usersGetErrors) {
            console.log(usersGetErrors);
            return { isCanvasSaved: false, canvasId, errorMessage: "500 - Internal Server Error." };
        }
        const maxNumberOfCanvases = (user as User).numberOfCanvases;
        const currentNumberOfCanvases = canvases.length;
        if (currentNumberOfCanvases >= maxNumberOfCanvases) {
            return { isCanvasSaved: false, canvasId, errorMessage: "Max number of canvases reached." }
        }
        canvasId = uuidv4();
    }

    let voxelsString: string[] = JSON.parse(canvasData.voxels);

    const canvasDataString = JSON.stringify({
        "version": canvasData.version,
        "dimension": canvasData.dimension,
        "pointLightPosition": canvasData.pointLightPosition.toString(),
        "backgroundColor": rgbToHex(canvasData.backgroundColor),
        "ambientStrength": canvasData.ambientStrength,
        "pointLightStrength": canvasData.pointLightStrength,
        "voxels": voxelsString,
        "canvasThumbnail": canvasData.canvasThumbnail
    });

    const publicity = canvasData.publicity == Publicity.Public ? "PUBLIC" : "PRIVATE";

    // Save canvas to data
    if (isNewCanvas) {
        const { errors, data: newCanvas } = await client.models.Canvases.create({
            owner: username,
            canvasId: canvasId,
            name: canvasData.name,
            description: canvasData.description,
            publicity: publicity
        });

        if (errors) {
            console.log(errors);
            return { isCanvasSaved: false, canvasId: null, errorMessage: "500 - Internal Server Error." }
        }
    } else {
        await client.models.Canvases.update({
            owner: username,
            canvasId: canvasId,
            name: canvasData.name,
            description: canvasData.description,
            publicity: publicity
        })
    }

    // Save canvas to storage
    try {
        const result = await uploadData({
            path: `canvases/${username}/${canvasId}`,
            data: canvasDataString,
        }).result;
        console.log('Succeeded: ', result);
        return { isCanvasSaved: true, canvasId, errorMessage: null }
    } catch (error) {
        console.log('Error : ', error);
        return { isCanvasSaved: false, canvasId, errorMessage: "500 - Internal Server Error." }
    }
}

export async function testServer() {
    console.log("here test server");

    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!username) {
        console.log("no user authenticated");
        return;
    }

    const { data: canvases, errors } = await client.queries.getCanvasesForUser({ user: username });
    if (canvases) {
        console.log(Object.keys(canvases));
    }
}

export async function doesUserExist(username: string) {
    if (!username) return false;
    const { errors, data: user } = await client.models.Users.get({ username });
    if (errors) {
        console.log(errors);
        throw (new Error("500 - Internal Server Error."));
    }
    return Object.keys(user as User).length > 0;
}

export async function getPublicCanvasIdsForUserServer(username: string):
    Promise<{
        areCanvasIdsLoaded: boolean, username: string | null,
        canvasIds: string[] | null, errorMessage: string | null
    }> {
    const { data: canvasesData, errors: getCanvasForUserErrors } =
        await client.queries.getCanvasesForUser({ user: username });

    if (canvasesData) {
        const canvasDataValues = Object.values(canvasesData).filter((canvas) => canvas !== null);
        const canvasIds: string[] = [];
        for (const canvas of canvasDataValues) {
            if (canvas && canvas.publicity == "PUBLIC") {
                canvasIds.push(canvas.canvasId);
            }
        }
        return { areCanvasIdsLoaded: true, username: username, canvasIds, errorMessage: null };
    }
    console.log(getCanvasForUserErrors);
    return { areCanvasIdsLoaded: false, username: null, canvasIds: null, errorMessage: "500 - Internal Server Error." }
}

export async function getCanvasIdsForSignedInUserServer():
    Promise<{
        areCanvasIdsLoaded: boolean, username: string | null,
        canvasIds: string[] | null, errorMessage: string | null
    }> {

    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { areCanvasIdsLoaded: false, username: null, canvasIds: null, errorMessage: "User not authenticated." }
    }

    const { data: canvasesData, errors: getCanvasForUserErrors } =
        await client.queries.getCanvasesForUser({ user: username });

    if (canvasesData) {
        const canvasDataValues = Object.values(canvasesData).filter((canvas) => canvas !== null);
        const canvasIds: string[] = [];
        for (const canvas of canvasDataValues) {
            if (canvas) {
                canvasIds.push(canvas.canvasId);
            }
        }
        return { areCanvasIdsLoaded: true, username: username, canvasIds, errorMessage: null };
    }
    console.log(getCanvasForUserErrors);
    return { areCanvasIdsLoaded: false, username: null, canvasIds: null, errorMessage: "500 - Internal Server Error." }
}