"use server";

import { getNewCanvasesServer } from "@/backend-lib/actions";
import { Suspense } from "react";
import CanvasCardWrapper from "../studio/canvas-card-wrapper";

export default async function PopularCanvases() {

    const { areCanvasIdsLoaded, canvasIds, errorMessage } = await getNewCanvasesServer();
    if (!areCanvasIdsLoaded || canvasIds == null) {
        console.log(errorMessage);
        return (
            <div>Unexpected error</div>
        );
    }

    return (
        <div className="flex flex-row gap-4 overflow-x-scroll">
            {canvasIds.map((canvasId) => {
                return (
                    <Suspense fallback={
                        <div className={`bg-gray-200 w-full h-full rounded-lg`}>
                        </div>} key={`canvasCard-${canvasId}`}>
                        <div className="w-80 md:w-96 lg:w-1/3 flex-none">
                            <CanvasCardWrapper canvasId={canvasId} key={canvasId} forOwner={false} displayOnError={false} />
                        </div>
                    </Suspense>
                );
            })}
        </div>
    );
}