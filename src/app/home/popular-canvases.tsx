"use server";

import { getPopularCanvasesServer } from "@/backend-lib/actions";
import { Suspense } from "react";
import CanvasCardWrapper from "../studio/canvas-card-wrapper";
import LoadMore, { loadMoreActionType } from "./load-more";

export const CanvasesList = async ({
    canvasIds
}: {
    canvasIds: string[]
}) => {
    return (
        <>{canvasIds.map((canvasId) => {
            return (
                <Suspense fallback={
                    <div className={`bg-gray-500 w-80 md:w-96 lg:w-1/3 rounded-lg`}>
                    </div>} key={`canvasCard-${canvasId}`}>
                    <CanvasCardWrapper canvasId={canvasId} key={canvasId} forOwner={false} />
                </Suspense>
            );
        })}</>
    )
}

const loadMorePopularCanvases: loadMoreActionType = async (currentToken: string | null) => {
    "use server";
    const { areCanvasIdsLoaded, canvasIds, nextToken, errorMessage } = await getPopularCanvasesServer(currentToken);
    if (!areCanvasIdsLoaded || canvasIds == null) {
        console.log(errorMessage);
        return [<></>, null];
    }

    if (canvasIds.length === 0) {
        return [null, null];
    }
    return [<CanvasesList canvasIds={canvasIds} key="NewCanvasesList" />, nextToken] as const;
}

export default async function PopularCanvases() {

    const { areCanvasIdsLoaded, canvasIds: initialCanvasIds, nextToken, errorMessage } = await getPopularCanvasesServer(null);
    if (!areCanvasIdsLoaded || initialCanvasIds == null) {
        console.log(errorMessage);
        return (
            <div>Unexpected error</div>
        );
    }

    return (
        <LoadMore firstNextToken={nextToken} loadMoreAction={loadMorePopularCanvases}
            key={"loadMoreContainerForPopularCanvases"} forStudio={false}>
            <CanvasesList canvasIds={initialCanvasIds} />
        </LoadMore>
    );
}