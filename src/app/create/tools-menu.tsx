'use client';

import {
    PencilIcon,
    XMarkIcon,
    EyeDropperIcon,
    CubeTransparentIcon
} from "@heroicons/react/24/outline";
import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";
import clsx from 'clsx';
import CanvasState, { EditToolModes, TracerMaterial } from '@/app/create/canvas-state';
import { vec3 } from "@/lib/gl-matrix/index";
import Scene from "@/lib/renderables/scene";

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

function rgbToHex(rbg: vec3): string {
    const red = Math.round(rbg[0] * 255).toString(16).padStart(2, '0');
    const green = Math.round(rbg[1] * 255).toString(16).padStart(2, '0');
    const blue = Math.round(rbg[2] * 255).toString(16).padStart(2, '0');
    const hexString = ("#" + red + green + blue).toLowerCase();
    return hexString;
}

function hexToRgb(hexString: string): vec3 | null {
    if (hexString.startsWith('#')) {
        hexString = hexString.slice(1);
    }
    if (!/^[0-9A-F]{6}$/i.test(hexString)) {
        console.error('Invalid hex string');
        return null;
    }

    const red = parseInt(hexString.substring(0, 2), 16) / 255.0;
    const green = parseInt(hexString.substring(2, 4), 16) / 255.0;
    const blue = parseInt(hexString.substring(4), 16) / 255.0;

    return vec3.fromValues(red, green, blue);
}

export default function ToolsMenu({ menuMode }: { menuMode: string }) {
    const [color, setColor] = useState(rgbToHex(Scene.hoverCubeColor));
    const [bgColor, setBgColor] = useState(rgbToHex(Scene.backgroundColor));
    const [showColor, setShowColor] = useState(false);
    const [showBgColor, setShowBgColor] = useState(false);
    const [showMaterial, setShowMaterial] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(CanvasState.tracerMaterial);
    const [toolMode, setToolMode] = useState(CanvasState.editToolMode);
    const [showLighting, setShowLighting] = useState(true);
    const [ambientLight, setAmbientLight] = useState(5);
    const [pointLight, setPointLight] = useState(5);
    const [rayTraceEnabled, setRayTraceEnabled] = useState(false);

    const handleMouseUp = () => {
        if (toolMode == EditToolModes.EyeDropper) {
            setColor(rgbToHex(Scene.hoverCubeColor));
            setSelectedMaterial(CanvasState.tracerMaterial);
        }
    }

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        }
    });


    const editToolButtons = Array.from(editToolMap).map(([mode, Link]) => {
        return <button onClick={() => {
            setToolMode(mode);
            CanvasState.editToolMode = mode;
        }} key={"editTool-" + mode}
            className={`${toolMode == mode ? "bg-pastel-green p-1" : "bg-sky-100 p-2"}
                        w-full h-full rounded-md hover:bg-pastel-green hover:p-1`}>
            <Link />
        </button>
    });

    const materialButtons = Array.from(materialMap).map(([material, materialName]) => {
        return <button onClick={() => {
            setSelectedMaterial(material);
            CanvasState.tracerMaterial = material;
        }} key={"material-" + materialName}
            className={`${selectedMaterial == material ? "bg-pastel-green text-base" : "bg-sky-100 text-sm"}
            rounded-md hover:bg-pastel-green hover:text-base`}>
            {materialName}
        </button>
    })

    return (
        <div className="h-full px-1 w-[12rem]">
            <div className={`${menuMode == "edit" ? "visible" : "hidden"} h-full`}>
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
                            Scene.hoverCubeColor = newColorRGB ? newColorRGB : Scene.hoverCubeColor;
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
                                Scene.backgroundColor = newColorRGB ? newColorRGB : Scene.backgroundColor;
                            }} />
                    </div>
                </div>
            </div>
            <div className={`${menuMode == "render" ? "visible" : "hidden"} h-full overflow-auto`}>
                <label className="inline-flex items-center cursor-pointer mt-2">
                    <input type="checkbox" checked={rayTraceEnabled}
                        onChange={() => {
                            setRayTraceEnabled(!rayTraceEnabled);
                            CanvasState.toggleRayTracing(!rayTraceEnabled);
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
                                CanvasState.setAmbienceStrength(ambienceStrength);
                            }} />
                        Ambience
                    </div>
                    <div className="flex gap-1">
                        <input type="range" min="1" max="10" value={pointLight} step="0.025" className=" w-24"
                            onChange={(e) => {
                                let pointLightStrength = Number(e.target.value);
                                setPointLight(pointLightStrength);
                                CanvasState.setPointLightStrength(pointLightStrength);
                            }} />
                        Point
                    </div>
                </div>
            </div>
            <div className={`${menuMode == "save" ? "visible" : "hidden"} h-full`}>
                <p>save placeholder</p>
            </div>
        </div>
    )
}