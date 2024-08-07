import CanvasState from "@/app/create/canvas-state";
import { loadCanvasServer, saveCanvasServer } from "./actions";
import { rgbToHex } from "@/utils/functions";

export type Voxel = {
    x: number,
    y: number,
    z: number,
    cubeColor: vec3,
    cubeMaterial: number
}

export type CanvasCardData = {
    name: string,
    ownerUsername: string,
    description: string,
    publicity: string,
    thumbnail: string | null,
    likeCount: number,
    viewCount: number,
}

export type CanvasData = {
    name: string,
    owner: string,
    description: string,
    publicity: string,
    likeCount: number,
    viewCount: number,
    version: string,
    dimension: number,
    pointLightPosition: vec3,
    backgroundColor: vec3,
    ambientStrength: number,
    pointLightStrength: number,
    viewerRef: vec3,
    viewerTheta: number,
    viewerPhi: number,
    viewerR: number,
    voxels: Voxel[]
}

export type CanvasDataSave = {
    name: string,
    owner: string,
    description: string,
    publicity: string
    version: string,
    dimension: number,
    pointLightPosition: vec3,
    backgroundColor: vec3,
    ambientStrength: number,
    pointLightStrength: number,
    voxels: string,
    viewerRef: vec3,
    viewerTheta: number,
    viewerPhi: number,
    viewerR: number,
    canvasThumbnail: string
}

export async function saveCanvas(canvasId: string | null, name: string, description: string, publicity: string, canvasState: CanvasState) {
    console.log('Saving canvas...');

    if (!canvasState || !canvasState.canvas || !canvasState.scene) {
        return { isCanvasSaved: false, errorMessage: "No scene attached." };
    }

    canvasState.camera

    let voxelsStringArray: string[] = [];
    for (let y = 0; y < canvasState.divisionFactor; y++) {
        let yIndex = y * Math.pow(canvasState.divisionFactor, 2);
        for (let x = 0; x < canvasState.divisionFactor; x++) {
            let xIndex = x * canvasState.divisionFactor;
            for (let z = 0; z < canvasState.divisionFactor; z++) {
                let cubeIndex = yIndex + xIndex + z;
                let cubeColor = canvasState.scene.cubeSpace.cubeColorSpace[cubeIndex];
                if (!cubeColor) continue;
                let cubeMaterial = canvasState.scene.cubeSpace.cubeMaterialSpace[cubeIndex];
                let voxelString = `${x},${y},${z}:${rgbToHex(cubeColor)}:${cubeMaterial}`;
                voxelsStringArray.push(voxelString);
            }
        }
    }
    // Create voxels string representation
    let voxelsString = JSON.stringify(voxelsStringArray);

    const width = canvasState.canvas.width;
    const height = canvasState.canvas.height;

    let startX = 0;
    let startY = 0;
    if (width > height) {
        startX = Math.floor((width - height) / 2);
    } else {
        startY = Math.floor((height - width) / 2);
    }
    const captureSize = Math.min(width, height);
    const destinationCaptureSize = Math.min(captureSize, 640);

    canvasState.renderer?.render(0);

    const resizedCanvas = document.createElement("canvas");
    const resizedContext = resizedCanvas.getContext("2d");
    resizedCanvas.width = destinationCaptureSize;
    resizedCanvas.height = destinationCaptureSize;

    resizedContext?.drawImage(canvasState.canvas, startX, startY, captureSize, captureSize, 0, 0,
        destinationCaptureSize, destinationCaptureSize);
    const canvasThumbnail = resizedCanvas.toDataURL("image/jpeg", 1.0);

    let canvasData: CanvasDataSave = {
        "name": name,
        "owner": "blank",
        "description": description,
        "publicity": publicity,
        "version": "0.1.0",
        "dimension": canvasState.divisionFactor,
        "pointLightPosition": canvasState.scene.sunCenter,
        "backgroundColor": canvasState.backgroundColor,
        "ambientStrength": canvasState.ambienceStrength,
        "pointLightStrength": canvasState.sunStrength,
        "voxels": voxelsString,
        "viewerRef": canvasState.camera.viewerRef,
        "viewerTheta": canvasState.camera.viewerTheta,
        "viewerPhi": canvasState.camera.viewerPhi,
        "viewerR": canvasState.camera.viewerR,
        "canvasThumbnail": canvasThumbnail
    };

    console.log("canvasID: " + canvasId);
    const { isCanvasSaved, canvasId: canvasIdNew, errorMessage } = await saveCanvasServer(canvasData, canvasId);

    return { isCanvasSaved, canvasIdNew, errorMessage };
}