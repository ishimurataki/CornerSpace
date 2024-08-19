"use server";

import { getCanvasIdsForSignedInUserServer, getPublicCanvasIdsForUserServer } from "@/backend-lib/actions";
import { Suspense } from "react";
import CanvasCardWrapper from "./canvas-card-wrapper";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";

export default async function Gallery({ forOwner, forUser }: { forOwner: boolean, forUser: string | null }) {

    let canvasIdsForGallery: string[] = [];
    if (forOwner) {
        const { areCanvasIdsLoaded, username, canvasIds, errorMessage } = await getCanvasIdsForSignedInUserServer();
        if (!areCanvasIdsLoaded || canvasIds == null || username == null) {
            return (
                <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex items-center justify-center">
                    An error occurred: {errorMessage}
                </div>
            )
        }
        canvasIdsForGallery = canvasIds;
    } else if (forUser) {
        const { areCanvasIdsLoaded, username, canvasIds, errorMessage } = await getPublicCanvasIdsForUserServer(forUser);
        if (!areCanvasIdsLoaded || canvasIds == null || username == null) {
            return (
                <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex items-center justify-center">
                    An error occurred: {errorMessage}
                </div>
            )
        }
        canvasIdsForGallery = canvasIds;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5 overflow-scroll mb-6">
            {forOwner ?
                <Link className={`bg-gray-200 w-full aspect-square rounded-lg flex justify-center items-center hover:border-4 border-gray-500 
            text-gray-500 hover:text-gray-700`}
                    href="/create"
                    title="Create new canvas!">
                    <PlusIcon className="w-1/2 h-1/2" />
                </Link> :
                ""
            }
            {canvasIdsForGallery.map((canvasId) => {
                return (
                    <Suspense fallback={
                        <div className={`bg-gray-200 w-full h-full rounded-lg`}>
                        </div>} key={`canvasCard-${canvasId}`}>
                        <CanvasCardWrapper canvasId={canvasId} key={canvasId} forOwner={forOwner} displayOnError={true} />
                    </Suspense>
                );
            })}
        </div>
    );
}