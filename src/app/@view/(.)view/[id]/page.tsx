"use server";

import Canvas from "@/app/studio/canvas";
import { isCanvasLikedForSignedInUserServer, loadCanvasServer } from "@/backend-lib/actions";
import { notFound } from "next/navigation";
import React from "react";
import Modal from "./modal";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";

export default async function ViewModal({ params }: { params: { id: string } }) {
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
        <Modal>
            <Canvas canvasId={canvasId} canvasData={canvasData} userSignedIn={signedIn} canvasLiked={canvasLiked} />
        </Modal>
    )
}