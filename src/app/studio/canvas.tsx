"use client";

import { useEffect, useRef, useState } from "react";
import CanvasState from "../create/canvas-state";
import Scene from "@/lib/renderables/scene";
import Controls from "@/lib/controls";
import { CanvasData, Voxel } from "@/backend-lib/data";
import Renderer from "@/lib/renderer";
import initShaderProgram from "@/lib/utils/shader-helper";
import { renderFragmentSource, renderVertexSource } from "@/lib/shaders/render-shader";
import { tracerFragmentSource, tracerVertexSource } from "@/lib/shaders/tracer-shader";
import { plainFragmentShaderSource, plainVertexShaderSource } from "@/lib/shaders/plain-shader";
import Link from "next/link";

const canvasState = new CanvasState();

export default function Canvas({ canvasData }: { canvasData: CanvasData }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let stopAnimation = false;

    const [rayTraceEnabled, setRayTraceEnabled] = useState(true);
    const [ambientLight, setAmbientLight] = useState(canvasData.ambientStrength);
    const [pointLight, setPointLight] = useState(canvasData.pointLightStrength);

    const toggleRayTrace = () => {
        canvasState.rayTrace = !rayTraceEnabled;
        setRayTraceEnabled(!rayTraceEnabled);
    }

    useEffect(() => {
        canvasState.divisionFactor = canvasData.dimension;
        canvasState.sideLength = 1 / canvasData.dimension;
        canvasState.backgroundColor = canvasData.backgroundColor;
        canvasState.ambienceStrength = canvasData.ambientStrength;
        canvasState.sunStrength = canvasData.pointLightStrength;

        const scene = new Scene(canvasState);
        scene.setSunCenter(canvasData.pointLightPosition);
        canvasData.voxels.forEach((voxel: Voxel) => {
            scene.cubeSpace.setCube(voxel.x, voxel.y, voxel.z, voxel.cubeColor, voxel.cubeMaterial);
        });
        const controls = new Controls(canvasState);

        canvasState.bindScene(scene);
        canvasState.bindControls(controls);

        canvasState.camera.reset();
        canvasState.rayTrace = true;

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

        const renderer = new Renderer(gl, canvasState, tracerShaderProgram, renderShaderProgram, plainShaderProgram);
        canvasState.renderer = renderer;

        gl.useProgram(plainShaderProgram);

        stopAnimation = false;
        let animationFrameId: number;
        const render = (now: number) => {
            if (!stopAnimation) {
                renderer.tick(now);
                renderer.render(now);
                canvasState.previousTime = now;
                animationFrameId = requestAnimationFrame(render);
            }
        }
        requestAnimationFrame(render);

        return () => {
            stopAnimation = true;
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [canvasData])

    return (
        <div className="z-40 fixed top-0 left-0 w-screen h-screen flex flex-col flex-nowrap gap-2 md:flex-row bg-black bg-opacity-80 overflow-scroll">
            <div className="grow flex justify-center items-center w-full h-4/5 min-h-[calc(75%)] md:h-full">
                <canvas ref={canvasRef} className="w-[calc(100%-30px)] md:w-11/12 h-full md:h-full rounded-lg" />
            </div>
            <div className="shrink flex justify-center items-center md:justify-end w-full md:h-full md:max-w-72 lg:max-w-96">
                <div className="bg-white rounded-lg py-2 px-4 flex flex-col gap-2 w-[calc(100%-30px)] md:w-full h-full">
                    <Link href={`/gallery/${canvasData.owner}`} className="hover:text-cyan-400">
                        @{canvasData.owner}
                    </Link>
                    <div className="text-lg">
                        {canvasData.name}
                    </div>
                    <div>
                        {canvasData.description}
                    </div>
                    <hr className="mt-32" />
                    <div>
                        <input type="checkbox" checked={rayTraceEnabled}
                            className="w-3 h-3 mr-2" onClick={() => toggleRayTrace()} />
                        <span className="">Enable Ray-Tracing</span>
                    </div>
                    <div className="flex gap-1">
                        <input type="range" min="1" max="10" value={ambientLight} step="0.025" className="w-24"
                            onChange={(e) => {
                                let ambienceStrength = Number(e.target.value);
                                setAmbientLight(ambienceStrength);
                                canvasState.setAmbienceStrength(ambienceStrength);
                            }} />
                        Ambience
                    </div>
                    <div className="flex gap-1">
                        <input type="range" min="1" max="10" value={pointLight} step="0.025" className=" w-24"
                            onChange={(e) => {
                                let pointLightStrength = Number(e.target.value);
                                setPointLight(pointLightStrength);
                                canvasState.setPointLightStrength(pointLightStrength);
                            }} />
                        Point
                    </div>

                </div>
            </div>
        </div>
    );
}