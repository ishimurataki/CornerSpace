"use server";
import { loadCanvasCardDataServer } from "@/backend-lib/actions";
import CanvasCard from "./canvas-card";

export default async function CanvasCardWrapper({ canvasId, forOwner }:
    { canvasId: string, forOwner: boolean }) {
    const { isCanvasLoaded, canvasCardData, errorMessage } = await loadCanvasCardDataServer(canvasId, forOwner);
    if (errorMessage && errorMessage.includes("not authorized")) {
        return (
            <div className="bg-gray-800 text-white w-full h-full rounded-lg p-10 flex-col items-center justify-center gap-2 hidden">
                Access to this canvas is not authorized.
            </div>
        );
    }
    return (
        <CanvasCard canvasCardData={canvasCardData} canvasId={canvasId} forOwner={forOwner} />
    );
}