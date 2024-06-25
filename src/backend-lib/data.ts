import CanvasState from "@/app/create/canvas-state";
import { loadCanvasServer, saveCanvasServer } from "./actions";

export type Voxel = {
    x: number,
    y: number,
    z: number,
    cubeColor: vec3,
    cubeMaterial: number
}

export enum Publicity {
    Public,
    Private
}

export type CanvasData = {
    name: string,
    owner: string,
    description: string,
    publicity: Publicity
    version: string,
    dimension: number,
    pointLightPosition: vec3,
    backgroundColor: vec3,
    ambientStrength: number,
    pointLightStrength: number,
    voxels: Voxel[],
    canvasThumbnail: string
}

export async function saveCanvas(canvasId: string | null, name: string, description: string, publicity: Publicity, canvasState: CanvasState) {
    console.log('Saving canvas...');

    if (!canvasState || !canvasState.canvas || !canvasState.scene) {
        console.log('No scene attached.');
        return;
    }

    const voxels: Voxel[] = [];
    for (let y = 0; y < canvasState.divisionFactor; y++) {
        let yIndex = y * Math.pow(canvasState.divisionFactor, 2);
        for (let x = 0; x < canvasState.divisionFactor; x++) {
            let xIndex = x * canvasState.divisionFactor;
            for (let z = 0; z < canvasState.divisionFactor; z++) {
                let cubeIndex = yIndex + xIndex + z;
                let cubeColor = canvasState.scene.cubeSpace.cubeColorSpace[cubeIndex];
                if (!cubeColor) continue;
                let cubeMaterial = canvasState.scene.cubeSpace.cubeMaterialSpace[cubeIndex];
                voxels.push({
                    x,
                    y,
                    z,
                    cubeColor,
                    cubeMaterial
                });
            }
        }
    }

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

    let canvasData: CanvasData = {
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
        "voxels": voxels,
        "canvasThumbnail": canvasThumbnail
    };

    console.log("canvasID: " + canvasId);
    const { isCanvasSaved, errorMessage } = await saveCanvasServer(canvasData, canvasId);

    if (isCanvasSaved) {
        console.log("Saved!");
    } else {
        console.log(errorMessage);
    }
}