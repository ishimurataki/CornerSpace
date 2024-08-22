"use server";

import { getLikedCanvasesForSignedInUserServer } from "@/backend-lib/actions";
import LoadMore, { loadMoreActionType } from "../home/load-more";
import { Suspense } from "react";
import CanvasCardWrapper from "./canvas-card-wrapper";

const CanvasesList = async ({
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
                    <CanvasCardWrapper canvasId={canvasId} key={canvasId} forOwner={false} displayOnError={false} />
                </Suspense>
            );
        })}</>
    )
}


const loadMoreLikedCanvases: loadMoreActionType = async (currentToken: string | null) => {
    "use server";
    const { areCanvasIdsLoaded, canvasIds, nextToken, errorMessage } = await getLikedCanvasesForSignedInUserServer(currentToken);
    if (!areCanvasIdsLoaded || canvasIds == null) {
        console.log(errorMessage);
        return [<></>, null];
    }
    if (canvasIds.length === 0) {
        return [null, null];
    }

    return [<CanvasesList canvasIds={canvasIds} key="LikedCanvasesList" />, nextToken] as const;
}

export default async function LikedCanvases() {

    const { areCanvasIdsLoaded, canvasIds: initialCanvasIds, nextToken, errorMessage } = await getLikedCanvasesForSignedInUserServer(null);
    if (!areCanvasIdsLoaded || initialCanvasIds == null) {
        console.log(errorMessage);
        return (
            <div>Unexpected error</div>
        );
    }

    return (
        <LoadMore firstNextToken={nextToken} loadMoreAction={loadMoreLikedCanvases}
            key={"loadMoreContainerForLikedCanvases"} forStudio={true}>
            <CanvasesList canvasIds={initialCanvasIds} />
        </LoadMore>
    );
}
