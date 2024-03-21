import Controls from "@/lib/controls";
import { vec2, mat4 } from "@/lib/gl-matrix/index";
import { PolarCamera } from "@/lib/polar-camera";
import Scene from "@/lib/renderables/scene";
import Renderer from "@/lib/renderer";

export enum TracerMaterial {
    Diffuse,
    Mirror
}

export enum EditToolModes {
    Pencil = 1,
    Eraser,
    EyeDropper,
    Selector
}

export default class CanvasState {

    static backgroundColor = "#8fb1b4";
    static canvas: HTMLCanvasElement;

    static divisionFactor: number = 32;
    static sideLength: number = 1 / this.divisionFactor;
    static upperLeft: vec2 = vec2.fromValues(-0.5, -0.5);

    static renderHoverCube: boolean = false;
    static renderSunSelection: boolean = false;

    static viewProjectionInverse: mat4 = mat4.create();

    static transitioning: boolean = false;
    static transitionTime: number = 0;
    static previousTime: number = performance.now();

    static rayTrace: boolean = false;
    static sampleCount: number = 0;
    static tracerMaterial: TracerMaterial = TracerMaterial.Diffuse;

    static sunStrength: number = 0.75;
    static ambienceStrength: number = 0.25;

    static editToolMode: EditToolModes = EditToolModes.Pencil;

    static scene: Scene;
    static controls: Controls;
    static camera: PolarCamera;
    static renderer: Renderer;

    public static setAmbienceStrength(strength: number): void {
        strength = Math.max(Math.min(strength, 10), 0);
        strength = (Math.pow(1.63, strength - 5.3) - 0.122) / 3;
        CanvasState.ambienceStrength = strength;
        CanvasState.sampleCount = 0;
    }

    public static setPointLightStrength(strength: number): void {
        strength = Math.max(Math.min(strength, 10), 0);
        strength = Math.pow(1.63, strength - 5.3) - 0.122;
        CanvasState.sunStrength = strength;
        CanvasState.sampleCount = 0;
    }

    public static toggleRayTracing(enableRayTrace: boolean): void {
        if (enableRayTrace != CanvasState.rayTrace) {
            CanvasState.rayTrace = enableRayTrace;
            CanvasState.sampleCount = 0;
        }
    }
}