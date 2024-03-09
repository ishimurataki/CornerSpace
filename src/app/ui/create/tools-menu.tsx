'use client';

import {
    PencilIcon,
    XMarkIcon,
    EyeDropperIcon,
    CubeTransparentIcon
} from "@heroicons/react/24/outline";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import clsx from 'clsx';

export default function ToolsMenu() {
    const [color, setColor] = useState("#aabbcc");
    const [bgColor, setBgColor] = useState("#aabbcc");
    const [showColor, setShowColor] = useState(false);
    const [showBgColor, setShowBgColor] = useState(false);
    return (
        <div className="h-full px-1">
            <div className="mt-1 grid grid-cols-4 gap-1 [&>*]:w-12 [&>*]:h-12 [&>*]:p-2 [&>*]:rounded-md [&>*]:bg-sky-100 [&>*:hover]:bg-pastel-green [&>*:hover]:p-1">
                <button><PencilIcon /></button>
                <button><XMarkIcon /></button>
                <button><EyeDropperIcon /></button>
                <button><CubeTransparentIcon /></button>
            </div>
            <hr className="h-px my-2 bg-gray-100 border-0" />
            <div className="h-[calc(100%-90px)] overflow-auto">
                <p className="text-sm cursor-pointer hover:bg-pastel-green p-1 rounded-md" onClick={() => setShowColor(!showColor)}><b className="relative right-0">Color:</b> {color}</p>
                <div className={clsx({ 'h-0': !showColor, 'h-40': showColor }, "transition-all duration-300 overflow-hidden")}>
                    <HexColorPicker className="px-4 max-h-full py-4" color={color} onChange={setColor} />
                </div>
                <hr className="h-px my-2 bg-gray-100 border-0" />
                <p className="text-sm cursor-pointer hover:bg-pastel-green p-1 rounded-md"><b>Material:</b></p>
                <hr className="h-px my-2 bg-gray-100 border-0" />
                <p className="text-sm cursor-pointer hover:bg-pastel-green p-1 rounded-md" onClick={() => setShowBgColor(!showBgColor)}><b>BG Color:</b> {bgColor}</p>
                <div className={clsx({ 'h-0': !showBgColor, 'h-40': showBgColor }, "transition-all duration-300 overflow-hidden")}>
                    <HexColorPicker className="px-4 max-h-full py-4" color={bgColor} onChange={setBgColor} />
                </div>
            </div>
        </div>
    )
}