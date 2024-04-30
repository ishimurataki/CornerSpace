'use client';

import ToolsMenu from "@/app/create/tools-menu";
import Canvas from '@/app/create/canvas';
import { useState } from "react";
import { useEffect } from "react";
import CanvasState from "./canvas-state";

export default function Page() {
    const [toolsMenuMode, setToolsMenuMode] = useState("edit");

    function handleKeyUp(e: KeyboardEvent) {
        if (e.code == "Space") {
            e.preventDefault();
            if (toolsMenuMode == "edit") {
                setToolsMenuMode("render");
                CanvasState.controls?.toggleToViewer();
            } else if (toolsMenuMode == "render") {
                setToolsMenuMode("edit");
                CanvasState.controls?.toggleToEditor();
            }
        }
    }

    useEffect(() => {
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keyup", handleKeyUp);
        }
    });

    return (
        <main className="h-screen p-2 flex flex-col md:overflow-hidden">
            <h1 className={`flex-none mb-1 text-3xl md:text-4xl`}>
                CuBit
            </h1>
            <div className="space-x-1 [&>*]:rounded-t-md [&>*]:px-3 [&>*:hover]:bg-pastel-red">
                <button
                    className={`${toolsMenuMode == "edit" ? "bg-pastel-red" : "bg-pastel-orange"}`}
                    onClick={() => {
                        if (toolsMenuMode != "edit") {
                            CanvasState.controls?.toggleToEditor();
                            setToolsMenuMode("edit");
                        }
                    }}>
                    Edit
                </button>
                <button
                    className={`${toolsMenuMode == "render" ? "bg-pastel-red" : "bg-pastel-orange"}`}
                    onClick={() => {
                        if (toolsMenuMode != "render") {
                            CanvasState.controls?.toggleToViewer();
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
            <div className="flex-1 w-full flex flex-row max-h min-h-0 min-w-0">
                <div className="my-1 bg-sea-green p-1">
                    <ToolsMenu menuMode={toolsMenuMode} />
                </div>
                <div className="flex-1 p-1">
                    <Canvas />
                </div>
            </div>
        </main>
    )
}