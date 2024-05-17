"use server";

import { type Schema } from "@/../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data'
import config from "@/../../amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { AuthError, confirmSignUp, fetchAuthSession, signUp } from "aws-amplify/auth";
import { uploadData } from 'aws-amplify/storage';
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import { CanvasData } from "./data";
import { v4 as uuidv4 } from 'uuid';

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

function validateCanvasData(canvasData: CanvasData): { valid: boolean, errorMessage: string | null } {

    // TODO: complete this validation function
    if (canvasData.dimension < 10 || canvasData.dimension > 100) {
        return { valid: false, errorMessage: "Canvas must have side dimension at least 10 and at most 100." }
    }
    canvasData.backgroundColor[0] = Math.max(0.0, Math.min(1.0, canvasData.backgroundColor[0]));
    canvasData.backgroundColor[1] = Math.max(0.0, Math.min(1.0, canvasData.backgroundColor[1]));
    canvasData.backgroundColor[2] = Math.max(0.0, Math.min(1.0, canvasData.backgroundColor[2]));

    return { valid: true, errorMessage: null };
}

function rgbToHex(rbg: vec3): string {
    const red = Math.round(rbg[0] * 255).toString(16).padStart(2, '0');
    const green = Math.round(rbg[1] * 255).toString(16).padStart(2, '0');
    const blue = Math.round(rbg[2] * 255).toString(16).padStart(2, '0');
    const hexString = ("#" + red + green + blue).toLowerCase();
    return hexString;
}

export async function saveCanvasServer(canvasData: CanvasData, canvasId: string | null = null):
    Promise<{ isCanvasSaved: boolean, errorMessage: string | null }> {

    const isNewCanvas = !canvasId;

    // Confirm that user is signed in
    const currentUser = await fetchUserAttributesServer();
    const signedIn = currentUser != undefined;
    const username = currentUser?.preferred_username;

    if (!signedIn || !username) {
        return { isCanvasSaved: false, errorMessage: "User not authenticated." }
    }

    // Confirm that canvas data passed is valid
    const { valid, errorMessage } = validateCanvasData(canvasData);
    if (!valid) {
        return { isCanvasSaved: false, errorMessage };
    }

    // Obtain correct canvasId
    const { data: canvases, errors: getCanvasForUserErrors } =
        await client.queries.getCanvasesForUser({ user: username });
    if (getCanvasForUserErrors || canvases == undefined || canvases == null) {
        console.log(getCanvasForUserErrors);
        return { isCanvasSaved: false, errorMessage: "500 - Internal Server Error." };
    }

    if (canvasId && !canvases.some((canvas) => canvas?.canvasId == canvasId)) {
        return { isCanvasSaved: false, errorMessage: "Invalid canvas ID." }
    } else {
        const { data: user, errors: usersGetErrors } = await client.models.Users.get({ username });
        if (usersGetErrors) {
            console.log(usersGetErrors);
            return { isCanvasSaved: false, errorMessage: "500 - Internal Server Error." };
        }
        let numberOfCanvases = (user as User).numberOfCanvases;
        if (canvases.length > numberOfCanvases) {
            return { isCanvasSaved: false, errorMessage: "Max number of canvases reached." }
        }
        canvasId = uuidv4();
    }

    // Create voxels string representation
    let voxelsString: string[] = [];
    for (let voxel of canvasData.voxels) {
        let voxelString = `${voxel.x},${voxel.y},${voxel.z}:${rgbToHex(voxel.cubeColor)}:${voxel.cubeMaterial}`;
        voxelsString.push(voxelString);
    }

    const canvasDataString = JSON.stringify({
        "version": canvasData.version,
        "dimension": canvasData.dimension,
        "pointLightPosition": canvasData.pointLightPosition,
        "backgroundColor": rgbToHex(canvasData.backgroundColor),
        "ambientStrength": canvasData.ambientStrength,
        "pointLightStrength": canvasData.pointLightStrength,
        "voxels": voxelsString,
    })

    // Save canvas to data
    if (isNewCanvas) {
        const { errors, data: newCanvas } = await client.models.Canvases.create({
            owner: username,
            canvasId: canvasId,
            name: "Test canvas",
            description: "Test description",
            publicity: "PUBLIC"
        });

        if (errors) {
            console.log(errors);
            return { isCanvasSaved: false, errorMessage: "500 - Internal Server Error." }
        }
    }
    // else {
    //     await client.models.Canvases.update({
    //         owner: username,
    //         canvasId: canvasId,
    //         name: "Test canvas",
    //         description: "Test description resaved",
    //         publicity: "PUBLIC"
    //     })
    // }

    // Save canvas to storage
    try {
        const result = await uploadData({
            path: `canvases/${username}/${canvasId}`,
            data: canvasDataString,
        }).result;
        console.log('Succeeded: ', result);
        return { isCanvasSaved: true, errorMessage: null }
    } catch (error) {
        console.log('Error : ', error);
        return { isCanvasSaved: false, errorMessage: "500 - Internal Server Error." }
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

    const { data, errors } = await client.queries.getCanvasesForUser({ user: username });
    if (data) {
        console.log("logging data");
        console.log(data);
    }
    if (errors) {
        console.log("logging errors");
        console.log(errors);
    }
    // const { errors, data: user } = await client.models.Users.get({ username });
    // let numberOfCanvases = (user as User).numberOfCanvases;

    // console.log(numberOfCanvases);
}