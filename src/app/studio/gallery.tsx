"use server";

import { getCanvasIdsForSignedInUserServer, getPublicCanvasIdsForUserServer } from "@/backend-lib/actions";
import LoadMore, { loadMoreActionType } from "../home/load-more";
import { Suspense } from "react";
import CanvasCardWrapper from "./canvas-card-wrapper";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

const CanvasesList = async ({
    canvasIds,
    forOwner
}: {
    canvasIds: string[],
    forOwner: boolean
}) => {
    return (
        <>{forOwner ?
            <Link className={`bg-gray-200 w-full aspect-square rounded-lg flex justify-center items-center hover:border-4 border-gray-500 
        text-gray-500 hover:text-gray-700`}
                href="/create"
                title="Create new canvas!">
                <PlusIcon className="w-1/2 h-1/2" />
            </Link> :
            ""
        }
            {canvasIds.map((canvasId) => {
                return (
                    <Suspense fallback={
                        <div className={`bg-gray-500 w-80 md:w-96 lg:w-1/3 rounded-lg`}>
                        </div>} key={`canvasCard-${canvasId}`}>
                        <CanvasCardWrapper canvasId={canvasId} key={canvasId} forOwner={forOwner} />
                    </Suspense>
                );
            })}</>
    )
}

const loadMoreCanvases = (forOwner: boolean) => (forUser: string | null): loadMoreActionType => async (currentToken: string | null) => {
    "use server";
    let canvasIdsForGallery: string[] = [];
    let nextTokenToReturn = null;
    if (forOwner) {
        const { areCanvasIdsLoaded, username, canvasIds, nextToken, errorMessage } = await getCanvasIdsForSignedInUserServer(currentToken);
        if (!areCanvasIdsLoaded || canvasIds == null || username == null) {
            console.log(errorMessage);
            return [<></>, null];
        }
        canvasIdsForGallery = canvasIds;
        nextTokenToReturn = nextToken;
    } else if (forUser) {
        const { areCanvasIdsLoaded, username, canvasIds, nextToken, errorMessage } = await getPublicCanvasIdsForUserServer(forUser, currentToken);
        if (!areCanvasIdsLoaded || canvasIds == null || username == null) {
            console.log(errorMessage);
            return [<></>, null];
        }
        canvasIdsForGallery = canvasIds;
        nextTokenToReturn = nextToken;
    }
    if (canvasIdsForGallery.length === 0) {
        return [null, null];
    }

    return [<CanvasesList canvasIds={canvasIdsForGallery} key="LikedCanvasesList" forOwner={forOwner} />, nextTokenToReturn] as const;
}

export default async function Gallery({ forOwner, forUser }: { forOwner: boolean, forUser: string | null }) {

    let initialCanvasIdsForGallery: string[] = [];
    let nextTokenToReturn = null;
    if (forOwner) {
        const { areCanvasIdsLoaded, username, canvasIds, nextToken, errorMessage } = await getCanvasIdsForSignedInUserServer(null);
        if (!areCanvasIdsLoaded || canvasIds == null || username == null) {
            return (
                <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex items-center justify-center">
                    An error occurred: {errorMessage}
                </div>
            )
        }
        initialCanvasIdsForGallery = canvasIds;
        nextTokenToReturn = nextToken;
    } else if (forUser) {
        const { areCanvasIdsLoaded, username, canvasIds, nextToken, errorMessage } = await getPublicCanvasIdsForUserServer(forUser, null);
        if (!areCanvasIdsLoaded || canvasIds == null || username == null) {
            return (
                <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex items-center justify-center">
                    An error occurred: {errorMessage}
                </div>
            )
        }
        initialCanvasIdsForGallery = canvasIds;
        nextTokenToReturn = nextToken;
    }

    return (
        <LoadMore firstNextToken={nextTokenToReturn} loadMoreAction={loadMoreCanvases(forOwner)(forUser)}
            key={"loadMoreContainerForLikedCanvases"} forStudio={true}>
            <CanvasesList canvasIds={initialCanvasIdsForGallery} forOwner={forOwner} />
        </LoadMore>
    );
}
