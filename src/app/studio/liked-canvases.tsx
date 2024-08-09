"use server";

import { getLikedCanvasesForSignedInUserServer } from "@/backend-lib/actions";
import { Suspense } from "react";
import CanvasCardWrapper from "./canvas-card-wrapper";

export default async function LikedCanvases() {

    const { areCanvasIdsLoaded, canvasIds, errorMessage } = await getLikedCanvasesForSignedInUserServer();
    if (!areCanvasIdsLoaded || canvasIds == null) {
        console.log(errorMessage);
        return (
            <div>Unexpected error</div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5 overflow-scroll mb-6">
            {canvasIds.map((canvasId) => {
                return (
                    <Suspense fallback={
                        <div className={`bg-gray-200 w-full h-full rounded-lg`}>
                        </div>} key={`canvasCard-${canvasId}`}>
                        <CanvasCardWrapper canvasId={canvasId} key={canvasId} forOwner={false} />
                    </Suspense>
                );
            })}
        </div>
    );
}