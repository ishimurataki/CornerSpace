"use client";

import { useEffect, useRef } from "react";
import CanvasState from "../create/canvas-state";
import Scene from "@/lib/renderables/scene";
import Controls from "@/lib/controls";
import { CanvasData, Voxel } from "@/backend-lib/data";
import Renderer from "@/lib/renderer";
import initShaderProgram from "@/lib/utils/shader-helper";
import { renderFragmentSource, renderVertexSource } from "@/lib/shaders/render-shader";
import { tracerFragmentSource, tracerVertexSource } from "@/lib/shaders/tracer-shader";
import { plainFragmentShaderSource, plainVertexShaderSource } from "@/lib/shaders/plain-shader";

export default function Canvas({ canvasData }: { canvasData: CanvasData }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasState = new CanvasState();
        if (canvasData) {
            canvasState.divisionFactor = canvasData.dimension;
            canvasState.sideLength = 1 / canvasData.dimension;
            canvasState.backgroundColor = canvasData.backgroundColor;
            canvasState.ambienceStrength = canvasData.ambientStrength;
            canvasState.sunStrength = canvasData.pointLightStrength;
        }
        const scene = new Scene(canvasState);
        scene.setSunCenter(canvasData.pointLightPosition);
        if (canvasData) {
            canvasData.voxels.forEach((voxel: Voxel) => {
                scene.cubeSpace.setCube(voxel.x, voxel.y, voxel.z, voxel.cubeColor, voxel.cubeMaterial);
            });
        }
        const controls = new Controls(canvasState);

        canvasState.bindScene(scene);
        canvasState.bindControls(controls);

        const canvas = canvasRef.current;
        if (canvas == null) {
            alert("Couldn't find canvas element.");
            return;
        }
        canvasState.canvas = canvas;

        const gl = canvas.getContext('webgl');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        if (gl == null) {
            alert("Unable to initialize WebGL context. Your browser or machine may not support it.");
            return;
        }

        canvasState.camera.changeWidthHeight(canvasState.canvas.clientWidth, canvasState.canvas.clientHeight);
        if (canvasState.scene) {
            canvasState.scene.bindToGLContext(gl);
        }
        if (canvasState.controls) {
            canvasState.controls.registerControls();
        }

        const plainShaderProgram: WebGLShader | null = initShaderProgram(gl, plainVertexShaderSource, plainFragmentShaderSource);
        if (plainShaderProgram == null) {
            alert("Could not compile plain shader program");
            return;
        }

        const tracerShaderProgram: WebGLShader | null = initShaderProgram(gl,
            tracerVertexSource,
            tracerFragmentSource(canvasState.divisionFactor));
        if (tracerShaderProgram == null) {
            alert("Could not compile tracer shader program");
            return;
        }

        const renderShaderProgram: WebGLShader | null = initShaderProgram(gl, renderVertexSource, renderFragmentSource);
        if (renderShaderProgram == null) {
            alert("Could not compile render shader program");
            return;
        }
        controls.toggleToViewer();
        canvasState.rayTrace = false;

        const renderer = new Renderer(gl, canvasState, tracerShaderProgram, renderShaderProgram, plainShaderProgram);
        canvasState.renderer = renderer;

        gl.useProgram(plainShaderProgram);

        let animationFrameId: number;
        const render = (now: number) => {
            renderer.tick(now);
            renderer.render(now);
            canvasState.previousTime = now;
            animationFrameId = requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [canvasData])

    return (
        <canvas ref={canvasRef} className="border-4 border-green-400 h-60 w-80" />
    );
}