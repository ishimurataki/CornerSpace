"use server";

import Canvas from "@/app/studio/canvas";
import { loadCanvasServer } from "@/backend-lib/actions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const canvasId = params.id;
    const { isCanvasLoaded, canvasData, errorMessage } = await loadCanvasServer(canvasId);
    if (!isCanvasLoaded || !canvasData) {
        console.log(errorMessage);
        notFound();
    }

    return (
        <main className="h-[calc(100vh-64px)]">
            <Canvas canvasData={canvasData} />
        </main>
    )
}