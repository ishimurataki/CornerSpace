import Renderable from "@/lib/renderables/renderable";
import Mesh from "@/lib/renderables/mesh";
import Grid from "@/lib/renderables/grid";
import Square from "@/lib/renderables/square";
import Cube from "@/lib/renderables/cube";
import SelectionBox from "@/lib/renderables/selection-box";
import CubeSpace from "@/lib/renderables/cube-space";

import { vec2, vec3, mat4 } from "@/lib/gl-matrix/index";
import CanvasState, { TracerMaterial } from "@/app/create/canvas-state";
import MirrorMarker from "./mirror-marker";
import { Axis } from "../polar-camera";

export default class Scene {
    gl: WebGLRenderingContext | null = null;
    canvasState: CanvasState;

    grid: Renderable;
    cubeLayer: Map<string, Renderable>;
    editorTiles: Set<Renderable>;
    hoverCube: Renderable;
    cubeSpace: CubeSpace;

    sun: Renderable;
    sunCenter: vec3 = vec3.fromValues(0, 0, 0);
    sunCorner: vec3 = vec3.fromValues(0, 0, 0);
    sunOn: boolean;
    sunSelection: Renderable;

    selector: Renderable;
    selectorDragStart: vec2 | null = null;
    selectorDragEnd: vec2 | null = null;

    private gridMesh: Mesh;
    private cubeMesh: Mesh;
    mirrorMarkerMesh: Mesh;
    private squareMesh: Mesh;
    private selectionMesh: Mesh;

    private currentLayerX = 0;
    private currentLayerY = 0;
    private currentLayerZ = 0;

    constructor(canvasState: CanvasState) {
        this.canvasState = canvasState;
        this.gridMesh = new Grid(canvasState.divisionFactor);
        this.squareMesh = new Square(canvasState.sideLength * 0.6);
        this.cubeMesh = new Cube(canvasState.sideLength);
        this.selectionMesh = new SelectionBox(canvasState.sideLength);
        this.mirrorMarkerMesh = new MirrorMarker(canvasState.sideLength);

        this.grid = new Renderable(this.gridMesh, vec3.fromValues(0.3, 0.3, 0.3), mat4.create());
        this.updateEditorAxis();
        this.editorTiles = new Set<Renderable>();
        this.cubeLayer = new Map<string, Renderable>();

        this.hoverCube = new Renderable(this.cubeMesh, canvasState.hoverCubeColor, mat4.create());
        this.setHoverCubePosition(0, 0);

        this.selector = new Renderable(this.selectionMesh, vec3.fromValues(0.2, 0.8, 1.0), mat4.create());

        this.cubeSpace = new CubeSpace(canvasState.divisionFactor, canvasState.upperBackLeft);
        this.sunOn = true;
        this.sun = new Renderable(this.cubeMesh,
            vec3.fromValues(1.0, 1.0, 1.0),
            mat4.create());
        this.sunSelection = new Renderable(this.selectionMesh, vec3.fromValues(1.0, 0.0, 0.0),
            mat4.create());
        this.setSunCenter(vec3.fromValues(0.0, 0.0, 0.0));
    }

    bindToGLContext(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.gridMesh.bindToGLContext(gl);
        this.squareMesh.bindToGLContext(gl);
        this.cubeMesh.bindToGLContext(gl);
        this.selectionMesh.bindToGLContext(gl);
        this.mirrorMarkerMesh.bindToGLContext(gl);
        this.cubeSpace.bindToGLContext(gl);

        this.selectionMesh.setDrawingMode(gl.LINES);
        this.gridMesh.setDrawingMode(gl.LINES);
        this.mirrorMarkerMesh.setDrawingMode(gl.TRIANGLES);
        this.cubeMesh.setDrawingMode(gl.TRIANGLES);
    }

    private getCubeString(x: number, y: number, z: number): string {
        return "cube_" + x + "_" + y + "_" + z;
    }

    setCubeLayer(layer: number): void {
        if (layer >= 0 && layer < this.canvasState.divisionFactor) {
            this.editorTiles.clear();
            this.cubeLayer.clear();
            let yStart = 0, xStart = 0, zStart = 0;
            let yEnd = this.canvasState.divisionFactor,
                xEnd = this.canvasState.divisionFactor,
                zEnd = this.canvasState.divisionFactor;
            switch (this.canvasState.editorAxis) {
                case Axis.X:
                    this.currentLayerX = layer;
                    xStart = this.currentLayerX;
                    xEnd = xStart + 1;
                    break;
                case Axis.Y:
                    this.currentLayerY = layer;
                    yStart = this.currentLayerY;
                    yEnd = yStart + 1;
                    break;
                case Axis.Z:
                    this.currentLayerZ = layer;
                    zStart = this.currentLayerZ;
                    zEnd = zStart + 1;
                    break;
            }
            for (let y = yStart; y < yEnd; y++) {
                let yPad = y * Math.pow(this.canvasState.divisionFactor, 2);
                let yBelowPad = (y - 1) * Math.pow(this.canvasState.divisionFactor, 2);
                for (let x = xStart; x < xEnd; x++) {
                    let xPad = x * this.canvasState.divisionFactor;
                    let xBelowPad = (x - 1) * this.canvasState.divisionFactor;
                    for (let z = zStart; z < zEnd; z++) {
                        let cubeColor = this.cubeSpace.cubeColorSpace[yPad + xPad + z];
                        if (cubeColor != undefined) {
                            let cubeMaterial = this.cubeSpace.cubeMaterialSpace[yPad + xPad + z];
                            this.addCubeToLayerOnly(x, y, z, cubeColor, cubeMaterial);
                        }
                        if (this.canvasState.editorAxis == Axis.Y && y >= 1) {
                            let cubeBelowColor = this.cubeSpace.cubeColorSpace[yBelowPad + xPad + z];
                            if (cubeBelowColor != undefined) {
                                this.addTile(x, y, z, cubeBelowColor);
                            }
                        } else if (this.canvasState.editorAxis == Axis.X && x >= 1) {
                            let cubeBelowColor = this.cubeSpace.cubeColorSpace[yPad + xBelowPad + z];
                            if (cubeBelowColor != undefined) {
                                this.addTile(x, y, z, cubeBelowColor);
                            }
                        } else if (this.canvasState.editorAxis == Axis.Z && z >= 1) {
                            let cubeBelowColor = this.cubeSpace.cubeColorSpace[yPad + xPad + z - 1];
                            if (cubeBelowColor != undefined) {
                                this.addTile(x, y, z, cubeBelowColor);
                            }
                        }
                    }
                }
            }
            this.updateEditorAxis();
        }
    }

    setHoverCubePosition(x: number, y: number): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor &&
            y >= 0 && y < this.canvasState.divisionFactor) {
            let xCoord = this.canvasState.upperBackLeft[0];
            let yCoord = this.canvasState.upperBackLeft[1];
            let zCoord = this.canvasState.upperBackLeft[2];
            switch (this.canvasState.editorAxis) {
                case Axis.X:
                    xCoord += (this.currentLayerX + 0.1) * this.canvasState.sideLength;
                    yCoord += this.canvasState.sideLength * x;
                    zCoord += this.canvasState.sideLength * y;
                    break;
                case Axis.Y:
                    xCoord += this.canvasState.sideLength * x;
                    yCoord += (this.currentLayerY + 0.1) * this.canvasState.sideLength;
                    zCoord += this.canvasState.sideLength * y;
                    break;
                case Axis.Z:
                    xCoord += this.canvasState.sideLength * x;
                    yCoord += this.canvasState.sideLength * y;
                    zCoord += (this.currentLayerZ + 0.1) * this.canvasState.sideLength;
                    break;
            }
            let hoverCubeModelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(xCoord, yCoord, zCoord));
            this.hoverCube.modelMatrix = hoverCubeModelMatrix;
            return true;
        }
        return false;
    }

    setHoverCubeColor(color: vec3) {
        this.canvasState.hoverCubeColor = color;
    }

    setBackgroundColor(color: vec3) {
        this.canvasState.backgroundColor = color;
    }

    addTile(x: number, y: number, z: number, color: vec3): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let tileModelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(
                this.canvasState.upperBackLeft[0] + this.canvasState.sideLength * (x + 0.5),
                this.canvasState.upperBackLeft[1] + this.canvasState.sideLength * (y + 0.5),
                this.canvasState.upperBackLeft[2] + this.canvasState.sideLength * (z + 0.5)
            ));
            if (this.canvasState.editorAxis == Axis.Z) {
                tileModelMatrix = mat4.rotateX(tileModelMatrix, tileModelMatrix, Math.PI / 2);
            } else if (this.canvasState.editorAxis == Axis.X) {
                tileModelMatrix = mat4.rotateZ(tileModelMatrix, tileModelMatrix, -Math.PI / 2);
            }
            let tileColor = vec3.copy(vec3.create(), color);
            let tileRenderable = new Renderable(this.squareMesh, tileColor, tileModelMatrix);
            this.editorTiles.add(tileRenderable);
            return true;
        }
        return false;
    }

    private addCubeToLayerOnly(x: number, y: number, z: number, color: vec3 = this.canvasState.hoverCubeColor,
        material: TracerMaterial = this.canvasState.tracerMaterial): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor &&
            y >= 0 && y < this.canvasState.divisionFactor &&
            z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeModelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(
                this.canvasState.upperBackLeft[0] + this.canvasState.sideLength * x,
                this.canvasState.upperBackLeft[1] + this.canvasState.sideLength * y,
                this.canvasState.upperBackLeft[2] + this.canvasState.sideLength * z
            ));
            let cubeKey = this.getCubeString(x, y, z);
            let cubeColor = vec3.copy(vec3.create(), color);
            let cubeRenderable = new Renderable(this.cubeMesh, cubeColor, cubeModelMatrix, material);
            this.cubeLayer.set(cubeKey, cubeRenderable);
            return true;
        }
        return false;
    }

    addCube(x: number, y: number, z: number, color: vec3 = this.canvasState.hoverCubeColor,
        material: TracerMaterial = this.canvasState.tracerMaterial): boolean {
        if (this.addCubeToLayerOnly(x, y, z, color, material)) {
            let cubeColor = vec3.copy(vec3.create(), color);
            this.cubeSpace.setCube(x, y, z, cubeColor, material);
            return true;
        }
        return false;
    }

    deleteCube(x: number, y: number, z: number): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeKey = this.getCubeString(x, y, z);
            if (this.cubeLayer.delete(cubeKey)) {
                this.cubeSpace.deleteCube(x, y, z);
                return true;
            }
        }
        return false;
    }

    getCubeColor(x: number, y: number, z: number): vec3 | null {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeKey = this.getCubeString(x, y, z);
            if (this.cubeLayer.has(cubeKey)) {
                let cubeColor = this.cubeLayer.get(cubeKey)?.color;
                if (cubeColor != undefined) return cubeColor;
            }
        }
        return null;
    }

    getCubeMaterial(x: number, y: number, z: number): TracerMaterial | null {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeKey = this.getCubeString(x, y, z);
            if (this.cubeLayer.has(cubeKey)) {
                let cubeMaterial = this.cubeLayer.get(cubeKey)?.material;
                if (cubeMaterial != undefined) return cubeMaterial;
            }
        }
        return null;
    }

    setSunCenter(position: vec3): void {
        this.sunCenter = position;
        this.sunCorner = vec3.subtract(vec3.create(), this.sunCenter,
            vec3.fromValues(this.canvasState.sideLength / 2, this.canvasState.sideLength / 2, this.canvasState.sideLength / 2));
        this.sun.modelMatrix = mat4.fromTranslation(mat4.create(), this.sunCorner);
        this.sunSelection.modelMatrix = mat4.fromTranslation(mat4.create(), this.sunCorner);
    }

    setSelectorDragStart(x: number, z: number): void {
        let xCoord = Math.max(0, Math.min(this.canvasState.divisionFactor - 1, x));
        let zCoord = Math.max(0, Math.min(this.canvasState.divisionFactor - 1, z));
        this.selectorDragStart = vec2.fromValues(xCoord, zCoord);
        this.updateSelectorPosition();
    }

    setSelectorDragEnd(x: number, z: number): void {
        let xCoord = Math.max(0, Math.min(this.canvasState.divisionFactor - 1, x));
        let zCoord = Math.max(0, Math.min(this.canvasState.divisionFactor - 1, z));
        this.selectorDragEnd = vec2.fromValues(xCoord, zCoord);
        this.updateSelectorPosition();
    }

    unsetSelector(): void {
        this.selectorDragStart = null;
        this.selectorDragEnd = null;
    }

    private updateSelectorPosition(): void {
        if (!this.selectorDragStart || !this.selectorDragEnd) {
            return;
        }
        const [x1, z1] = this.selectorDragStart;
        const [x2, z2] = this.selectorDragEnd;

        const x = (x1 < x2) ? x1 : x2;
        const z = (z1 < z2) ? z1 : z2;

        const width = Math.abs(x1 - x2) + 1;
        const height = Math.abs(z1 - z2) + 1;

        let xCoord = this.canvasState.upperBackLeft[0];
        let yCoord = this.canvasState.upperBackLeft[1];
        let zCoord = this.canvasState.upperBackLeft[2];
        let xScale = 1, yScale = 1, zScale = 1;

        switch (this.canvasState.editorAxis) {
            case Axis.X:
                xCoord += this.canvasState.sideLength * (this.currentLayerX + 0.1);
                yCoord += this.canvasState.sideLength * x;
                zCoord += this.canvasState.sideLength * z;
                yScale = width;
                zScale = height;
                break;
            case Axis.Y:
                xCoord += this.canvasState.sideLength * x;
                yCoord += this.canvasState.sideLength * (this.currentLayerY + 0.1);
                zCoord += this.canvasState.sideLength * z;
                xScale = width;
                zScale = height;
                break;
            case Axis.Z:
                xCoord += this.canvasState.sideLength * x;
                yCoord += this.canvasState.sideLength * z;
                zCoord += this.canvasState.sideLength * (this.currentLayerZ + 0.1);
                xScale = width;
                yScale = height;
                break;
        }

        const selectorTranslate = mat4.fromTranslation(mat4.create(), vec3.fromValues(xCoord, yCoord, zCoord));
        const selectorModelMatrix = mat4.scale(mat4.create(), selectorTranslate, vec3.fromValues(xScale, yScale, zScale));

        this.selector.modelMatrix = selectorModelMatrix;
    }

    selectorFill(): void {
        if (!this.selectorDragStart || !this.selectorDragEnd) {
            return;
        }
        const [x1, z1] = this.selectorDragStart;
        const [x2, z2] = this.selectorDragEnd;

        const xMin = Math.min(x1, x2);
        const xMax = Math.max(x1, x2);

        const zMin = Math.min(z1, z2);
        const zMax = Math.max(z1, z2);

        switch (this.canvasState.editorAxis) {
            case Axis.X:
                for (let x = xMin; x <= xMax; x++) {
                    for (let z = zMin; z <= zMax; z++) {
                        this.addCube(this.currentLayerX, x, z, this.canvasState.hoverCubeColor, this.canvasState.tracerMaterial);
                    }
                }
                break;
            case Axis.Y:
                for (let x = xMin; x <= xMax; x++) {
                    for (let z = zMin; z <= zMax; z++) {
                        this.addCube(x, this.currentLayerY, z, this.canvasState.hoverCubeColor, this.canvasState.tracerMaterial);
                    }
                }
                break;
            case Axis.Z:
                for (let x = xMin; x <= xMax; x++) {
                    for (let z = zMin; z <= zMax; z++) {
                        this.addCube(x, z, this.currentLayerZ, this.canvasState.hoverCubeColor, this.canvasState.tracerMaterial);
                    }
                }
                break;
        }
    }

    selectorClear(): void {
        if (!this.selectorDragStart || !this.selectorDragEnd) {
            return;
        }
        const [x1, z1] = this.selectorDragStart;
        const [x2, z2] = this.selectorDragEnd;

        const xMin = Math.min(x1, x2);
        const xMax = Math.max(x1, x2);

        const zMin = Math.min(z1, z2);
        const zMax = Math.max(z1, z2);

        switch (this.canvasState.editorAxis) {
            case Axis.X:
                for (let x = xMin; x <= xMax; x++) {
                    for (let z = zMin; z <= zMax; z++) {
                        this.deleteCube(this.currentLayerX, x, z);
                    }
                }
                break;
            case Axis.Y:
                for (let x = xMin; x <= xMax; x++) {
                    for (let z = zMin; z <= zMax; z++) {
                        this.deleteCube(x, this.currentLayerY, z);
                    }
                }
                break;
            case Axis.Z:
                for (let x = xMin; x <= xMax; x++) {
                    for (let z = zMin; z <= zMax; z++) {
                        this.deleteCube(x, z, this.currentLayerZ);
                    }
                }
                break;
        }
    }

    updateEditorAxis() {
        this.unsetSelector();
        let xStart = this.canvasState.upperBackLeft[0];
        let yStart = this.canvasState.upperBackLeft[1];
        let zStart = this.canvasState.upperBackLeft[2];
        let gridModelMatrix = mat4.create();
        if (this.canvasState.editorAxis == Axis.Z) {
            zStart += (this.currentLayerZ + 1) * this.canvasState.sideLength;
        } else if (this.canvasState.editorAxis == Axis.X) {
            xStart += (this.currentLayerX + 1) * this.canvasState.sideLength;
        } else if (this.canvasState.editorAxis == Axis.Y) {
            yStart += this.currentLayerY * this.canvasState.sideLength;
        }
        gridModelMatrix = mat4.fromTranslation(gridModelMatrix, vec3.fromValues(xStart, yStart, zStart));
        if (this.canvasState.editorAxis == Axis.Z) {
            gridModelMatrix = mat4.rotateX(gridModelMatrix, gridModelMatrix, -Math.PI / 2);
        } else if (this.canvasState.editorAxis == Axis.X) {
            gridModelMatrix = mat4.rotateZ(gridModelMatrix, gridModelMatrix, Math.PI / 2);
        }
        this.grid.modelMatrix = gridModelMatrix;
    }
}