import CanvasState from "@/app/create/canvas-state";
import { rgbToHex } from "@/app/create/tools-menu";

export async function saveCanvas() {
    console.log('Saving canvas...');

    let voxels: String[] = [];
    for (let y = 0; y < CanvasState.divisionFactor; y++) {
        let yIndex = y * Math.pow(CanvasState.divisionFactor, 2);
        for (let x = 0; x < CanvasState.divisionFactor; x++) {
            let xIndex = x * CanvasState.divisionFactor;
            for (let z = 0; z < CanvasState.divisionFactor; z++) {
                let cubeIndex = yIndex + xIndex + z;
                let cubeColor = CanvasState.scene.cubeSpace.cubeColorSpace[cubeIndex];
                if (!cubeColor) continue;
                let cubeMaterial = CanvasState.scene.cubeSpace.cubeMaterialSpace[cubeIndex];
                let cubeString = `${x},${y},${z}:${rgbToHex(cubeColor)}:${cubeMaterial}`;
                voxels.push(cubeString);
            }
        }
    }
    let backgroundColor = rgbToHex(CanvasState.backgroundColor);
    let pointLightPosition = CanvasState.scene.sunCenter.toString();

    let canvasObject = {
        "version": "0.1.0",
        "dimension": CanvasState.divisionFactor,
        "pointLightPosition": pointLightPosition,
        "backgroundColor": backgroundColor,
        "ambientStrength": CanvasState.ambienceStrength,
        "pointLightStrength": CanvasState.sunStrength,
        "voxels": voxels,
    };
    let canvasObjectString = JSON.stringify(canvasObject);
    console.log(JSON.parse(canvasObjectString));

    console.log("Saved!");
}

"1.1.1:#hexColor:material,"