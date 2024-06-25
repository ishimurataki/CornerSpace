"use server";

import { loadCanvasServer } from "@/backend-lib/actions";
import CanvasCard from "./canvas-card";

export default async function CanvasCardWrapper({ canvasId }: { canvasId: string }) {
    const { isCanvasLoaded, canvasData, errorMessage } = await loadCanvasServer(canvasId);
    if (!canvasData) {
        return (
            <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex items-center justify-center">
                An error occurred: {errorMessage}
            </div>
        )
    }

    return (
        <CanvasCard canvasData={canvasData} canvasId={canvasId} />
    );
}