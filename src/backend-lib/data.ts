import CanvasState from "@/app/create/canvas-state";
import { rgbToHex } from "@/app/create/tools-menu";
import { saveCanvasServer } from "./actions";

export type Voxel = {
    x: number,
    y: number,
    z: number,
    cubeColor: vec3,
    cubeMaterial: number
}

export type CanvasData = {
    version: string,
    dimension: number,
    pointLightPosition: vec3,
    backgroundColor: vec3,
    ambientStrength: number,
    pointLightStrength: number,
    voxels: Voxel[]
}

export async function saveCanvas() {
    console.log('Saving canvas...');

    const voxels: Voxel[] = [];
    for (let y = 0; y < CanvasState.divisionFactor; y++) {
        let yIndex = y * Math.pow(CanvasState.divisionFactor, 2);
        for (let x = 0; x < CanvasState.divisionFactor; x++) {
            let xIndex = x * CanvasState.divisionFactor;
            for (let z = 0; z < CanvasState.divisionFactor; z++) {
                let cubeIndex = yIndex + xIndex + z;
                let cubeColor = CanvasState.scene.cubeSpace.cubeColorSpace[cubeIndex];
                if (!cubeColor) continue;
                let cubeMaterial = CanvasState.scene.cubeSpace.cubeMaterialSpace[cubeIndex];
                voxels.push({
                    x,
                    y,
                    z,
                    cubeColor,
                    cubeMaterial
                });
                // let cubeString = `${x},${y},${z}:${cubeColor}:${cubeMaterial}`;
                // voxels.push(cubeString);
            }
        }
    }


    // let voxels: String[] = [];
    // for (let y = 0; y < CanvasState.divisionFactor; y++) {
    //     let yIndex = y * Math.pow(CanvasState.divisionFactor, 2);
    //     for (let x = 0; x < CanvasState.divisionFactor; x++) {
    //         let xIndex = x * CanvasState.divisionFactor;
    //         for (let z = 0; z < CanvasState.divisionFactor; z++) {
    //             let cubeIndex = yIndex + xIndex + z;
    //             let cubeColor = CanvasState.scene.cubeSpace.cubeColorSpace[cubeIndex];
    //             if (!cubeColor) continue;
    //             let cubeMaterial = CanvasState.scene.cubeSpace.cubeMaterialSpace[cubeIndex];
    //             let cubeString = `${x},${y},${z}:${rgbToHex(cubeColor)}:${cubeMaterial}`;
    //             voxels.push(cubeString);
    //         }
    //     }
    // }
    let backgroundColor = rgbToHex(CanvasState.backgroundColor);
    let pointLightPosition = CanvasState.scene.sunCenter.toString();

    let canvasData: CanvasData = {
        "version": "0.1.0",
        "dimension": CanvasState.divisionFactor,
        "pointLightPosition": CanvasState.scene.sunCenter,
        "backgroundColor": CanvasState.backgroundColor,
        "ambientStrength": CanvasState.ambienceStrength,
        "pointLightStrength": CanvasState.sunStrength,
        "voxels": voxels,
    };
    // let canvasObjectString = JSON.stringify(canvasObject);
    // console.log(JSON.parse(canvasObjectString));
    const { isCanvasSaved, errorMessage } = await saveCanvasServer(canvasData);

    if (!isCanvasSaved) {
        console.log(errorMessage);
    }

    console.log("Saved!");
}

// "1.1.1:#hexColor:material,"