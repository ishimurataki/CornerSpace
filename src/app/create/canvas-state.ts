import Controls from "@/lib/controls";
import { vec2, vec3, mat4 } from "@/lib/gl-matrix/index";
import { Axis, PolarCamera } from "@/lib/polar-camera";
import Scene from "@/lib/renderables/scene";
import Renderer from "@/lib/renderer";

export enum TracerMaterial {
    Diffuse = 1,
    Mirror
}

export enum EditToolModes {
    Pencil = 1,
    Eraser,
    EyeDropper,
    Selector
}

export default class CanvasState {
    canvas: HTMLCanvasElement | null = null;

    layerLabel: HTMLElement | null = null;
    layerContainer: HTMLElement | null = null;

    divisionFactor: number = 16;
    sideLength: number = 1 / this.divisionFactor;
    upperBackLeft: vec2 = vec3.fromValues(-0.5, -0.5, -0.5);

    hoverCubeColor: vec3 = vec3.fromValues(0.31372, 0.7843, 0.47059);
    backgroundColor: vec3 = vec3.fromValues(0.15, 0.15, 0.15);

    renderHoverCube: boolean = false;
    renderSunSelection: boolean = false;

    viewProjectionInverse: mat4 = mat4.create();

    transitioning: boolean = false;
    transitionTime: number = 0;
    previousTime: number = performance.now();

    rayTrace: boolean = true;
    sampleCount: number = 0;
    tracerMaterial: TracerMaterial = TracerMaterial.Diffuse;

    sunStrength: number = 5.0;
    ambienceStrength: number = 5.0;

    editToolMode: EditToolModes = EditToolModes.Pencil;

    scene: Scene | null = null;
    controls: Controls | null = null;
    camera: PolarCamera = new PolarCamera(0, 0);
    renderer: Renderer | null = null;

    editorAxis: Axis = Axis.Y;

    constructor() {
    }

    bindScene(scene: Scene) {
        this.scene = scene;
    }

    bindControls(controls: Controls) {
        this.controls = controls;
    }

    setAmbienceStrength(strength: number): void {
        this.ambienceStrength = strength;
        this.sampleCount = 0;
    }

    setPointLightStrength(strength: number): void {
        this.sunStrength = strength;
        this.sampleCount = 0;
    }

    toggleRayTracing(enableRayTrace: boolean): void {
        if (enableRayTrace != this.rayTrace) {
            this.rayTrace = enableRayTrace;
            this.sampleCount = 0;
        }
    }

    setLayerLabel(layer: number): void {
        if (this.layerLabel) {
            this.layerLabel.innerHTML = ` ${layer.toString()} `;
        }
    }

    setLayerVisible(layerVisibility: boolean): void {
        if (this.layerContainer) {
            this.layerContainer.style.visibility = (layerVisibility) ? "visible" : "hidden";
        }
    }
}