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

    private gridMesh: Mesh;
    private cubeMesh: Mesh;
    mirrorMarkerMesh: Mesh;
    private squareMesh: Mesh;
    private selectionMesh: Mesh;
    private currentLayer = 0;

    constructor(canvasState: CanvasState) {
        this.canvasState = canvasState;
        this.gridMesh = new Grid(canvasState.divisionFactor);
        this.squareMesh = new Square(canvasState.sideLength);
        this.cubeMesh = new Cube(canvasState.sideLength);
        this.selectionMesh = new SelectionBox(canvasState.sideLength);
        this.mirrorMarkerMesh = new MirrorMarker(canvasState.sideLength);

        let gridModelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(canvasState.upperLeft[0], 0, canvasState.upperLeft[1]));
        this.grid = new Renderable(this.gridMesh, vec3.fromValues(0.3, 0.3, 0.3), gridModelMatrix);
        this.editorTiles = new Set<Renderable>();
        this.cubeLayer = new Map<string, Renderable>();

        this.hoverCube = new Renderable(this.cubeMesh, canvasState.hoverCubeColor, mat4.create());
        this.setHoverCubePosition(0, 0);

        this.cubeSpace = new CubeSpace(canvasState.divisionFactor, canvasState.upperLeft);
        this.sunOn = true;
        this.sun = new Renderable(this.cubeMesh,
            vec3.fromValues(1.0, 1.0, 1.0),
            mat4.create());
        this.sunSelection = new Renderable(this.selectionMesh, vec3.fromValues(1.0, 0.0, 0.0),
            mat4.create());
        this.setSunCenter(vec3.fromValues(0.0, 0.5, 0.0));
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
    }

    private getCubeString(x: number, z: number): string {
        return "cube_" + x + "_" + z;
    }

    setCubeLayer(y: number): void {
        if (y >= 0 && y < this.canvasState.divisionFactor) {
            this.editorTiles.clear();
            this.cubeLayer.clear();
            this.currentLayer = y;
            let yPad = y * Math.pow(this.canvasState.divisionFactor, 2);
            let yBelowPad = (y - 1) * Math.pow(this.canvasState.divisionFactor, 2);
            for (let x = 0; x < this.canvasState.divisionFactor; x++) {
                let xPad = x * this.canvasState.divisionFactor;
                for (let z = 0; z < this.canvasState.divisionFactor; z++) {
                    let cubeColor = this.cubeSpace.cubeColorSpace[yPad + xPad + z];
                    if (cubeColor != undefined) {
                        let cubeMaterial = this.cubeSpace.cubeMaterialSpace[yPad + xPad + z];
                        this.addCubeToLayerOnly(x, z, cubeColor, cubeMaterial);
                    }
                    if (y >= 1) {
                        let cubeBelowColor = this.cubeSpace.cubeColorSpace[yBelowPad + xPad + z];
                        if (cubeBelowColor != undefined) {
                            this.addTile(x, z, cubeBelowColor);
                        }
                    }
                }
            }
            this.grid.modelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(
                this.canvasState.upperLeft[0],
                this.currentLayer * this.canvasState.sideLength,
                this.canvasState.upperLeft[1]));
        }
    }

    setHoverCubePosition(x: number, z: number): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let hoverCubeModelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(
                this.canvasState.upperLeft[0] + this.canvasState.sideLength * x,
                this.currentLayer * this.canvasState.sideLength,
                this.canvasState.upperLeft[1] + this.canvasState.sideLength * z
            ));
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

    addTile(x: number, z: number, color: vec3): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let tileModelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(
                this.canvasState.upperLeft[0] + this.canvasState.sideLength * x,
                this.canvasState.sideLength * this.currentLayer,
                this.canvasState.upperLeft[1] + this.canvasState.sideLength * z
            ));
            let tileColor = vec3.copy(vec3.create(), color);
            let tileRenderable = new Renderable(this.squareMesh, tileColor, tileModelMatrix);
            this.editorTiles.add(tileRenderable);
            return true;
        }
        return false;
    }

    private addCubeToLayerOnly(x: number, z: number, color: vec3 = this.canvasState.hoverCubeColor,
        material: TracerMaterial = this.canvasState.tracerMaterial): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeModelMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(
                this.canvasState.upperLeft[0] + this.canvasState.sideLength * x,
                this.canvasState.sideLength * this.currentLayer,
                this.canvasState.upperLeft[1] + this.canvasState.sideLength * z
            ));
            let cubeKey = this.getCubeString(x, z);
            let cubeColor = vec3.copy(vec3.create(), color);
            let cubeRenderable = new Renderable(this.cubeMesh, cubeColor, cubeModelMatrix, material);
            this.cubeLayer.set(cubeKey, cubeRenderable);
            return true;
        }
        return false;
    }

    addCube(x: number, z: number, color: vec3 = this.canvasState.hoverCubeColor,
        material: TracerMaterial = this.canvasState.tracerMaterial): boolean {
        if (this.addCubeToLayerOnly(x, z, color, material)) {
            let cubeColor = vec3.copy(vec3.create(), color);
            this.cubeSpace.setCube(x, this.currentLayer, z, cubeColor, material);
            return true;
        }
        return false;
    }

    deleteCube(x: number, z: number): boolean {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeKey = this.getCubeString(x, z);
            if (this.cubeLayer.delete(cubeKey)) {
                this.cubeSpace.deleteCube(x, this.currentLayer, z);
                return true;
            }
        }
        return false;
    }

    getCubeColor(x: number, z: number): vec3 | null {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeKey = this.getCubeString(x, z);
            if (this.cubeLayer.has(cubeKey)) {
                let cubeColor = this.cubeLayer.get(cubeKey)?.color;
                if (cubeColor != undefined) return cubeColor;
            }
        }
        return null;
    }

    getCubeMaterial(x: number, z: number): TracerMaterial | null {
        if (x >= 0 && x < this.canvasState.divisionFactor && z >= 0 && z < this.canvasState.divisionFactor) {
            let cubeKey = this.getCubeString(x, z);
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
}