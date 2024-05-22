"use client"

import { CanvasData, Publicity, saveCanvas, Voxel } from "@/backend-lib/data";
import CanvasState, { EditToolModes, TracerMaterial } from "./canvas-state";
import Scene from "@/lib/renderables/scene";
import Controls from "@/lib/controls";
import initShaderProgram from "@/lib/utils/shader-helper";
import { plainFragmentShaderSource, plainVertexShaderSource } from "@/lib/shaders/plain-shader";
import { tracerFragmentSource, tracerVertexSource } from "@/lib/shaders/tracer-shader";
import { renderFragmentSource, renderVertexSource } from "@/lib/shaders/render-shader";
import Renderer from "@/lib/renderer";
import { useEffect, useRef, useState } from "react";
import {
    PencilIcon,
    XMarkIcon,
    EyeDropperIcon,
    CubeTransparentIcon
} from "@heroicons/react/24/outline";
import { hexToRgb, rgbToHex } from "@/utils/functions";
import clsx from 'clsx';
import { HexColorPicker } from "react-colorful";

const editToolMap = new Map([
    [EditToolModes.Pencil, PencilIcon],
    [EditToolModes.Eraser, XMarkIcon],
    [EditToolModes.EyeDropper, EyeDropperIcon],
    [EditToolModes.Selector, CubeTransparentIcon],
]);

const materialMap = new Map([
    [TracerMaterial.Diffuse, "matte"],
    [TracerMaterial.Mirror, "mirror"]
]);

const canvasState = new CanvasState();
const scene = new Scene(canvasState);
const controls = new Controls(canvasState);
canvasState.bindScene(scene);
canvasState.bindControls(controls);

export default function CanvasWrapper({ canvasId, canvasData }: { canvasId: string | null, canvasData: CanvasData | null }) {

    const [mounted, setMounted] = useState(false);

    if (!mounted && canvasData) {
        canvasState.divisionFactor = canvasData.dimension;
        scene.setSunCenter(canvasData.pointLightPosition);
        canvasState.backgroundColor = canvasData.backgroundColor;
        canvasState.ambienceStrength = canvasData.ambientStrength;
        canvasState.sunStrength = canvasData.pointLightStrength;

        canvasData.voxels.forEach((voxel: Voxel) => {
            scene.cubeSpace.setCube(voxel.x, voxel.y, voxel.z, voxel.cubeColor, voxel.cubeMaterial);
        });
    }

    const [toolsMenuMode, setToolsMenuMode] = useState("edit");
    const [color, setColor] = useState(rgbToHex(canvasState.hoverCubeColor));
    const [bgColor, setBgColor] = useState(rgbToHex(canvasState.backgroundColor));
    const [showColor, setShowColor] = useState(false);
    const [showBgColor, setShowBgColor] = useState(false);
    const [showMaterial, setShowMaterial] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(canvasState.tracerMaterial);
    const [toolMode, setToolMode] = useState(canvasState.editToolMode);
    const [showLighting, setShowLighting] = useState(true);
    const [ambientLight, setAmbientLight] = useState(canvasState.ambienceStrength);
    const [pointLight, setPointLight] = useState(canvasState.sunStrength);
    const [rayTraceEnabled, setRayTraceEnabled] = useState(canvasState.rayTrace);
    const [title, setTitle] = useState(canvasData ? canvasData.name : "");
    const [description, setDescription] = useState(canvasData ? canvasData.description : "");
    const [publicity, setPublicity] = useState(canvasData ? canvasData.publicity : Publicity.Public);
    const [saving, setSaving] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function handleKeyUp(e: KeyboardEvent) {
        if (e.code == "Space") {
            e.preventDefault();
            if (toolsMenuMode === "edit") {
                setToolsMenuMode("render");
                canvasState.controls?.toggleToViewer();
            } else if (toolsMenuMode === "render") {
                setToolsMenuMode("edit");
                canvasState.controls?.toggleToEditor();
            }
        }
    }

    const handleMouseUp = () => {
        if (toolMode == EditToolModes.EyeDropper) {
            setColor(rgbToHex(canvasState.hoverCubeColor));
            setSelectedMaterial(canvasState.tracerMaterial);
        }
    }

    useEffect(() => {
        setMounted(true);
        const canvas = canvasRef.current;
        if (canvas == null) {
            alert("Couldn't find canvas element.");
            return;
        }
        canvasState.canvas = canvas;

        const layerLabel = document.getElementById("layerLabel");
        const layerContainer = document.getElementById("layerContainer");
        if (layerLabel == null || layerContainer == null) {
            alert("Couldn't find layer label element.");
            return;
        }
        canvasState.layerLabel = layerLabel;
        canvasState.layerContainer = layerContainer;

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

        const renderer = new Renderer(gl, canvasState, tracerShaderProgram, renderShaderProgram, plainShaderProgram);
        canvasState.renderer = renderer;

        gl.useProgram(plainShaderProgram);

        if (canvasData) {
            controls.toggleToViewer();
            setToolsMenuMode("render");
        }

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
    }, []);

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("mouseup", handleMouseUp);
        }
    });

    const editToolButtons = Array.from(editToolMap).map(([mode, Link]) => {
        return <button onClick={() => {
            setToolMode(mode);
            canvasState.editToolMode = mode;
        }} key={"editTool-" + mode}
            className={`${toolMode == mode ? "bg-pastel-green p-1" : "bg-sky-100 p-2"}
                        w-full h-full rounded-md hover:bg-pastel-green hover:p-1`}>
            <Link />
        </button>
    });

    const materialButtons = Array.from(materialMap).map(([material, materialName]) => {
        return <button onClick={() => {
            setSelectedMaterial(material);
            canvasState.tracerMaterial = material;
        }} key={"material-" + materialName}
            className={`${selectedMaterial == material ? "bg-pastel-green text-base" : "bg-sky-100 text-sm"}
            rounded-md hover:bg-pastel-green hover:text-base`}>
            {materialName}
        </button>
    });

    const handleSave = async () => {
        setSaving(true);
        await saveCanvas(canvasId, title, description, publicity, canvasState);
        setSaving(false);
    }

    return (
        <div className="flex-1 w-full flex flex-row max-h min-h-0 min-w-0">
            <div className="p-1 max-h flex flex-col gap-1">
                <div className="space-x-1 [&>*]:rounded-t-md [&>*]:px-3 [&>*:hover]:bg-pastel-red flex-none">
                    <button
                        className={`${toolsMenuMode == "edit" ? "bg-pastel-red" : "bg-pastel-orange"}`}
                        onClick={() => {
                            if (toolsMenuMode != "edit") {
                                canvasState.controls?.toggleToEditor();
                                setToolsMenuMode("edit");
                            }
                        }}>
                        Edit
                    </button>
                    <button
                        className={`${toolsMenuMode == "render" ? "bg-pastel-red" : "bg-pastel-orange"}`}
                        onClick={() => {
                            if (toolsMenuMode != "render") {
                                canvasState.controls?.toggleToViewer();
                                setToolsMenuMode("render");
                            }
                        }}>
                        Render
                    </button>
                    <button
                        className={`${toolsMenuMode == "save" ? "bg-pastel-red" : "bg-pastel-orange"}`}
                        onClick={() => setToolsMenuMode("save")}>
                        Save
                    </button>
                </div>
                <div className=" bg-sea-green px-1 w-[12.5rem] flex-1">
                    <div className={`${toolsMenuMode == "edit" ? "visible" : "hidden"} h-full`}>
                        <div className="mt-1 grid grid-cols-4 gap-1">
                            {editToolButtons}
                        </div>
                        <hr className="h-px my-2 bg-gray-100 border-0" />
                        <div className="h-[calc(100%-90px)] overflow-auto">
                            <p className="text-sm cursor-pointer hover:bg-pastel-green p-1 rounded-md"
                                onClick={() => setShowColor(!showColor)}>
                                <b>Color:</b> {color}
                            </p>
                            <div className={clsx({ 'h-0': !showColor, 'h-40': showColor }, "transition-all duration-300 overflow-hidden")}>
                                <HexColorPicker className="px-4 max-h-full max-w-full py-4" color={color} onChange={(newColor) => {
                                    setColor(newColor);
                                    let newColorRGB = hexToRgb(newColor);
                                    canvasState.hoverCubeColor = newColorRGB ? newColorRGB : canvasState.hoverCubeColor;
                                }} />
                            </div>
                            <hr className="h-px my-2 bg-gray-100 border-0" />
                            <p className="text-sm cursor-pointer hover:bg-pastel-green p-1 rounded-md"
                                onClick={() => setShowMaterial(!showMaterial)}>
                                <b>Material:</b>
                            </p>
                            <div className={clsx({ 'h-0 pt-0': !showMaterial, 'h-10 py-1': showMaterial }, "transition-all duration-300 overflow-hidden grid grid-cols-2 gap-2")}>
                                {materialButtons}
                            </div>
                            <hr className="h-px my-2 bg-gray-100 border-0" />
                            <p className="text-sm cursor-pointer hover:bg-pastel-green p-1 rounded-md"
                                onClick={() => setShowBgColor(!showBgColor)}>
                                <b>BG Color:</b> {bgColor}
                            </p>
                            <div className={clsx({ 'h-0': !showBgColor, 'h-40': showBgColor }, "transition-all duration-300 overflow-hidden")}>
                                <HexColorPicker className="px-4 max-h-full max-w-full py-4" color={bgColor}
                                    onChange={(newColor) => {
                                        setBgColor(newColor);
                                        let newColorRGB = hexToRgb(newColor);
                                        canvasState.backgroundColor = newColorRGB ? newColorRGB : canvasState.backgroundColor;
                                    }} />
                            </div>
                        </div>
                    </div>
                    <div className={`${toolsMenuMode == "render" ? "visible" : "hidden"} h-full overflow-auto`}>
                        <label className="inline-flex items-center cursor-pointer mt-2">
                            <input type="checkbox" checked={rayTraceEnabled}
                                onChange={() => {
                                    setRayTraceEnabled(!rayTraceEnabled);
                                    canvasState.toggleRayTracing(!rayTraceEnabled);
                                }} className="w-4 h-4 rounded mx-1" />
                            <span className="text-sm p-1">Enable Ray-Tracing</span>
                        </label>
                        <hr className="h-px my-2 bg-gray-100 border-0" />
                        <p className="text-sm cursor-pointer hover:bg-pastel-green p-1 rounded-md"
                            onClick={() => setShowLighting(!showLighting)}>
                            <b>Lighting:</b></p>
                        <div className={clsx({ 'h-0': !showLighting, 'h-12': showLighting }, "transition-all duration-300 overflow-hidden m-1 text-xs flex flex-col gap-1")}>
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
                    <div className={`${toolsMenuMode == "save" ? "visible" : "hidden"} h-full`}>
                        <input placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-8 block mt-2 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 " />
                        <textarea
                            placeholder="Add a description here"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block h-40 mt-2 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 
                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                        <div className="pt-2">
                            <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Publicity: </label>
                            <select
                                onChange={(e) => setPublicity(e.target.value == "Public" ? Publicity.Public : Publicity.Private)}
                                value={publicity}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                        px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value={Publicity.Public}>Public</option>
                                <option value={Publicity.Private}>Private</option>
                            </select>
                        </div>
                        <button className="bg-sky-100 rounded-md px-2 mt-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50" aria-disabled={saving} onClick={handleSave}>Save</button>
                        {/* <button className="bg-sky-100 rounded-md px-2 mt-2 ml-10" onClick={() => testServer()}>test</button> */}
                        {/* <button className="bg-sky-100 rounded-md px-2 mt-2 ml-10" onClick={() => loadCanvas("cc6a85a5-9581-469e-9d2b-8d96403b9b7c")}>test</button> */}
                    </div>
                </div>
            </div>
            <div className="flex-1 p-1">
                <div className="h-full w-full relative">
                    <div className="absolute top-3 right-4 text-xl text-white" id="layerContainer">Layer:
                        <text className="text-3xl" id="layerLabel"> 1 </text>/ 32
                    </div>
                    <canvas ref={canvasRef} className="border-4 border-pastel-green h-full w-full min-h-0 min-w-0" />
                </div>
            </div>
        </div>
    );
}