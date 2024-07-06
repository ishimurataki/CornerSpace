"use server";

import CanvasCardWrapper from "./canvas-card-wrapper";
import { getCanvasIdsForSignedInUserServer } from "@/backend-lib/actions";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function App() {

  const { areCanvasIdsLoaded, username, canvasIds, errorMessage } = await getCanvasIdsForSignedInUserServer();
  if (!areCanvasIdsLoaded || canvasIds == null || username == null) {
    console.log(errorMessage);
    redirect('signin');
  }

  return (
    <main className="absolute flex flex-col m-6 md:m-8 lg:m-10">
      <p className="text-2xl">@{username}&apos; Studio</p>
      <p className="text-lg mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5" >Your Gallery</p >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5 overflow-scroll">
        {canvasIds.map((canvasId) => {
          return (
            <Suspense fallback={
              <div className={`bg-gray-200 w-full h-full rounded-lg`}>
              </div>} key={`canvasCard-${canvasId}`}>
              <CanvasCardWrapper canvasId={canvasId} key={canvasId} forOwner={true} />
            </Suspense>
          );
        })}
      </div>
    </main >
  );
}