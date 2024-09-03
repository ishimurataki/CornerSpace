"use client";

import { CanvasCardData } from "@/backend-lib/data";
import Link from "next/link";
import { useState } from "react";
import {
    EllipsisVerticalIcon,
    GlobeAmericasIcon,
    EyeSlashIcon,
    HeartIcon,
    EyeIcon
} from "@heroicons/react/24/outline";
import { deleteCanvasServer, loadCanvasCardDataServer } from "@/backend-lib/actions";

export default function CanvasCard({ canvasCardData, canvasId, forOwner }: { canvasCardData: CanvasCardData | null, canvasId: string, forOwner: boolean }) {
    const [canvasCardDataState, setCanvasCardDataState] = useState<CanvasCardData | null>(canvasCardData);
    const [hover, setHover] = useState(false);
    const [showEllipsisDropdown, setShowEllipsisDropdown] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [showCanvasCard, setShowCanvasCard] = useState(true);
    const [reloading, setReloading] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        const { isCanvasDeleted, errorMessage } = await deleteCanvasServer(canvasId);
        if (isCanvasDeleted) {
            setDeleteError(null);
            setShowCanvasCard(false);
        } else {
            setDeleteError(errorMessage);
        }
        setDeleting(false);
    }

    const reloadData = async () => {
        setReloading(true);
        const { isCanvasLoaded, canvasCardData: newCanvasCardData, errorMessage } = await loadCanvasCardDataServer(canvasId);
        if (!isCanvasLoaded || !newCanvasCardData) {
            setReloading(false);
            return;
        }
        setCanvasCardDataState(newCanvasCardData);
        setReloading(false);
    }

    if (!canvasCardDataState) {
        return (
            <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex flex-col items-center justify-center gap-2">
                An error occurred.
                <button className="bg-cyan-400 hover:bg-cyan-600 rounded-lg p-1 px-2 text-white aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                    onClick={() => { reloadData() }}
                    aria-disabled={reloading}
                    disabled={reloading}>
                    Retry
                </button>
            </div>);
    }

    return (
        <div className={`${showCanvasCard ? "block" : "hidden"}`}>
            <div className="relative hover:border-4 border-cyan-400 rounded-lg max-w-fit z-20 aspect-square"
                onMouseOver={() => setHover(true)}
                onMouseLeave={() => {
                    setHover(false);
                    setShowEllipsisDropdown(false);
                    setShowDescription(false);
                }}
            >
                <img src={canvasCardDataState.thumbnail ? canvasCardDataState.thumbnail : undefined} className="rounded-lg bg-gray-400 aspect-square" alt={canvasCardDataState.name + " thumbnail"} />
                {hover ?
                    <div>
                        {showDescription ?
                            <div className="p-4 absolute top-0 w-full h-full text-white rounded-b-md bg-slate-600 bg-opacity-50 flex flex-col justify-between">
                                <div className="overflow-y-scroll no-scrollbar">{canvasCardDataState.description}</div>
                                <button className="text-xs hover:text-cyan-400 text-left" onClick={() => setShowDescription(false)}>
                                    hide description
                                </button>
                            </div> :
                            <div>
                                <div className="absolute top-0 left-0 m-4">{canvasCardDataState.publicity == "PUBLIC" ?
                                    <div className="flex flex-row"><GlobeAmericasIcon className="text-white w-7" /></div> :
                                    <div className="flex flex-row"><EyeSlashIcon className="text-white w-7" /></div>}
                                </div>
                                <div className="absolute top-0 right-0 mt-4 flex flex-col items-end mr-1">
                                    {forOwner ? <EllipsisVerticalIcon className="text-white h-10 hover:text-cyan-400"
                                        onClick={() => setShowEllipsisDropdown(!showEllipsisDropdown)} /> : ""}
                                    {forOwner && showEllipsisDropdown ?
                                        <div className="bg-white mr-4 p-2 rounded-md flex flex-col gap-1">
                                            <Link href={`/create/${canvasId}`} className="hover:text-cyan-600">Edit</Link>
                                            <hr />
                                            <button className="hover:text-cyan-600"
                                                onClick={() => { setShowConfirmDelete(true); }}>
                                                Delete
                                            </button>
                                        </div>
                                        : ""
                                    }
                                </div>
                                <div className="p-4 absolute bottom-0 w-full text-white rounded-b-md bg-gradient-to-t from-black">
                                    <div className="flex flex-row gap-2 text-sm">
                                        <HeartIcon className="text-white w-5" />{canvasCardDataState.likeCount}
                                    </div>
                                    <div className="flex flex-row gap-2 text-sm">
                                        <EyeIcon className="text-white w-5" />{canvasCardDataState.viewCount}
                                    </div>
                                    <span>
                                        <Link href={`/user/${canvasCardDataState.ownerUsername}`} className="hover:text-cyan-400">
                                            @{canvasCardDataState.ownerUsername}
                                        </Link>
                                    </span><span> | </span>
                                    <span>
                                        <Link href={`/view/${canvasId}`} className="text-lg hover:text-cyan-400">
                                            {canvasCardDataState.name}
                                        </Link>
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
            </div>
            {showConfirmDelete ?
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 p-10 z-30">
                    <div className="bg-sea-green max-w-[calc(500px)] p-10 rounded-lg flex flex-col gap-4">
                        <div className="text-2xl">Confirm Delete</div>
                        <div>Are you sure you want to delete this canvas? This action is permanent and cannot be undone.</div>
                        <div className="flex flex-row gap-2">
                            <button className="bg-black text-white w-fit p-3 rounded-lg hover:border-4 border-cyan-400 hover:p-2
                                aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                                onClick={() => handleDelete()}
                                aria-disabled={deleting}
                                disabled={deleting}>
                                Delete
                            </button>
                            <button className="bg-white w-fit p-3 rounded-lg hover:border-4 border-cyan-400 hover:p-2"
                                onClick={() => {
                                    setShowConfirmDelete(false);
                                    setDeleteError(null);
                                }}>
                                Back
                            </button>
                        </div>
                        {deleteError ? <div className="text-red-600">{deleteError}</div> : ""}
                    </div>
                </div>
                : ""
            }
        </div>
    );
}