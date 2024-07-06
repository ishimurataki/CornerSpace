"use server";

import { loadCanvasServer } from "@/backend-lib/actions";
import { notFound } from "next/navigation";
import CanvasWrapper from "../canvas-wrapper";

export default async function Page({ params }: { params: { id: string } }) {
    const canvasId = params.id;
    const { isCanvasLoaded, canvasData, errorMessage } = await loadCanvasServer(canvasId);
    if (!isCanvasLoaded) {
        console.log(errorMessage);
        notFound();
    }

    return (
        <main className="h-[calc(100vh-74px)] mt-1 flex flex-col md:overflow-hidden">
            <div className="flex-1 w-full flex flex-row max-h min-h-0 min-w-0">
                <CanvasWrapper canvasId={canvasId} canvasData={canvasData} />
            </div>
        </main>
    );
}