import CanvasState from "@/app/create/canvas-state";
import { loadCanvasSever, saveCanvasServer } from "./actions";

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
    description: string,
    publicity: Publicity
    version: string,
    dimension: number,
    pointLightPosition: vec3,
    backgroundColor: vec3,
    ambientStrength: number,
    pointLightStrength: number,
    voxels: Voxel[]
}

// export async function loadCanvas(id: string):
//     Promise<{ canvasData: CanvasData | null; errorMessage: string | null; }> {
//     console.log("Loading canvas...");

//     const { isCanvasLoaded, canvasData, errorMessage } = await loadCanvasSever(id);

//     if (isCanvasLoaded && canvasData) {
//         CanvasState.divisionFactor = canvasData.dimension;
//         CanvasState.scene.setSunCenter(canvasData.pointLightPosition);
//         CanvasState.backgroundColor = canvasData.backgroundColor;
//         CanvasState.ambienceStrength = canvasData.ambientStrength;
//         CanvasState.sunStrength = canvasData.pointLightStrength;

//         canvasData.voxels.forEach((voxel: Voxel) => {
//             CanvasState.scene.cubeSpace.setCube(voxel.x, voxel.y, voxel.z, voxel.cubeColor, voxel.cubeMaterial);
//         });

//         CanvasState.controls.toggleToViewer();
//         console.log("Canvas loaded...");
//         return { canvasData, errorMessage: null };
//     }
//     return { canvasData: null, errorMessage };
// }

export async function saveCanvas(canvasId: string | null, name: string, description: string, publicity: Publicity, canvasState: CanvasState) {
    console.log('Saving canvas...');

    if (!canvasState.scene) {
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

    let canvasData: CanvasData = {
        "name": name,
        "description": description,
        "publicity": publicity,
        "version": "0.1.0",
        "dimension": canvasState.divisionFactor,
        "pointLightPosition": canvasState.scene.sunCenter,
        "backgroundColor": canvasState.backgroundColor,
        "ambientStrength": canvasState.ambienceStrength,
        "pointLightStrength": canvasState.sunStrength,
        "voxels": voxels,
    };
    const { isCanvasSaved, errorMessage } = await saveCanvasServer(canvasData, canvasId);

    if (isCanvasSaved) {
        console.log("Saved!");
    } else {
        console.log(errorMessage);
    }
}