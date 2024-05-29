"use server";

import { loadCanvasSever } from "@/backend-lib/actions";
import { notFound } from "next/navigation";
import CanvasWrapper from "../canvas-wrapper";

export default async function Page({ params }: { params: { id: string } }) {
    const canvasId = params.id;
    const { isCanvasLoaded, canvasData, errorMessage } = await loadCanvasSever(canvasId);
    if (!isCanvasLoaded) {
        console.log(errorMessage);
        notFound();
    }

    return (
        <main className="h-screen p-2 flex flex-col md:overflow-hidden">
            <h1 className={`flex-none mb-1 text-3xl md:text-4xl`}>
                CuBit
            </h1>
            <CanvasWrapper canvasId={canvasId} canvasData={canvasData} />
        </main>
    );
}