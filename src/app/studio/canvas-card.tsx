"use client";

import { CanvasData } from "@/backend-lib/data";
import Link from "next/link";
import { useState } from "react";
import {
    EllipsisVerticalIcon,
    GlobeAmericasIcon,
    EyeSlashIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";
import Canvas from "./canvas";

export default function CanvasCard({ canvasData, canvasId }: { canvasData: CanvasData, canvasId: string }) {
    const [hover, setHover] = useState(false);
    const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showCanvasComponent, setShowCanvasComponent] = useState(false);
    return (
        <div className="relative hover:border-4 border-cyan-400 rounded-lg max-w-fit"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                setShowEllipsisDropdown(false);
                setShowDescription(false);
            }}
        >
            <img src={canvasData.canvasThumbnail} className="rounded-lg" alt={canvasData.name + " thumbnail"} />
            {hover ?
                <div>
                    {showDescription ?
                        <div className="p-4 absolute top-0 w-full h-full text-white rounded-b-md bg-slate-600 bg-opacity-50 flex flex-col justify-between">
                            <div>{canvasData.description}</div>
                            <button className="text-xs hover:text-cyan-400 text-left" onClick={() => setShowDescription(false)}>
                                hide description
                            </button>
                        </div> :
                        <div>
                            <div className="absolute top-0 left-0 m-4">{canvasData.publicity == 0 ?
                                <div className="flex flex-row"><GlobeAmericasIcon className="text-white w-7" /></div> :
                                <div className="flex flex-row"><EyeSlashIcon className="text-white w-7" /></div>}
                            </div>
                            <div className="absolute top-0 right-0 mt-4 flex flex-col items-end mr-1">
                                <EllipsisVerticalIcon className="text-white h-10 hover:text-cyan-400"
                                    onClick={() => setShowEllipsisDropdown(!showEllipsisDropdown)} />
                                {showEllipsisDropdown ?
                                    <div className="bg-white mr-4 p-2 rounded-md flex flex-col gap-1">
                                        <Link href={`/create/${canvasId}`} className="hover:text-cyan-600">Edit</Link>
                                        <hr />
                                        <button className="hover:text-cyan-600">Delete</button>
                                    </div>
                                    : ""
                                }
                            </div>
                            <div className="p-4 absolute bottom-0 w-full text-white rounded-b-md bg-gradient-to-t from-black">
                                <span>
                                    <Link href={`/gallery/${canvasData.owner}`} className="hover:text-cyan-400">
                                        @{canvasData.owner}
                                    </Link>
                                </span><span> | </span>
                                <span className="text-lg hover:text-cyan-400 cursor-pointer" onClick={() => setShowCanvasComponent(true)}>
                                    {canvasData.name}
                                </span>
                                <div>
                                    <button className="text-xs hover:text-cyan-400" onClick={() => setShowDescription(true)}>
                                        show description
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                : ""
            }
            {showCanvasComponent ?
                <div>
                    <div className="z-50 fixed top-4 left-8 w-12 h-12 text-white bg-gray-600 rounded-lg p-2 hover:text-cyan-400 hover:p-1">
                        <XCircleIcon onClick={() => setShowCanvasComponent(false)} />
                    </div>
                    <Canvas canvasData={canvasData} />
                </div>
                : ""
            }
        </div>
    );
}