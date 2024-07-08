"use server";

import { loadCanvasCardDataServer } from "@/backend-lib/actions";
import CanvasCard from "./canvas-card";

export default async function CanvasCardWrapper({ canvasId, forOwner }: { canvasId: string, forOwner: boolean }) {
    const { isCanvasLoaded, canvasCardData, errorMessage } = await loadCanvasCardDataServer(canvasId);
    if (!isCanvasLoaded || !canvasCardData) {
        return (
            <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex items-center justify-center">
                An error occurred: {errorMessage}
            </div>
        )
    }

    return (
        <CanvasCard canvasCardData={canvasCardData} canvasId={canvasId} forOwner={forOwner} />
    );
}