"use server";

import CanvasCardWrapper from "@/app/studio/canvas-card-wrapper";
import { doesUserExist, getCanvasIdsForUserServer } from "@/backend-lib/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function UserPage({ params }: { params: { username: string } }) {
  const userExists = await doesUserExist(params.username);
  if (!userExists) {
    notFound();
  }
  const { areCanvasIdsLoaded, username, canvasIds, errorMessage } = await getCanvasIdsForUserServer(params.username);
  if (!areCanvasIdsLoaded || canvasIds == null) {
    return (
      <div className="bg-gray-200 w-full h-full rounded-lg p-10 flex items-center justify-center">
        An error occurred: {errorMessage}
      </div>
    )
  }

  return (
    <main className="flex flex-col m-6 md:m-8 lg:m-10">
      <p className="text-2xl">@{username}&apos; Gallery</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5 overflow-scroll">
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
    </main >
  );
}