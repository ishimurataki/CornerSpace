"use server";

import Canvas from "@/app/studio/canvas";
import { isCanvasLikedForSignedInUserServer, loadCanvasServer } from "@/backend-lib/actions";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const canvasId = params.id;

    const { isCanvasLoaded, canvasData, errorMessage } = await loadCanvasServer(canvasId);

    if (!isCanvasLoaded || !canvasData) {
        console.log(errorMessage);
        notFound();
    }

    const user = await fetchUserAttributesServer();
    const signedIn = user != undefined;

    let canvasLiked = false;
    if (signedIn) {
        const { isCanvasLiked, errorMessage: isCanvasLikedErrorMessage } = await isCanvasLikedForSignedInUserServer(canvasId);
        canvasLiked = !!isCanvasLiked;
    }

    return (
        <main className="h-[calc(100vh-64px)]">
            <Canvas canvasId={canvasId} canvasData={canvasData} userSignedIn={signedIn} canvasLiked={canvasLiked} />
        </main>
    )
}