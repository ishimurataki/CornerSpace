"use server";

import CanvasCardWrapper from "./canvas-card-wrapper";
import { getCanvasIdsForSignedInUserServer, getNumberOfCanvasesForSignedInUserServer } from "@/backend-lib/actions";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";

export default async function App() {

  const user = await fetchUserAttributesServer();
  const signedIn = user != undefined;

  const { areCanvasIdsLoaded, username, canvasIds, errorMessage } = await getCanvasIdsForSignedInUserServer();
  if (!signedIn || !areCanvasIdsLoaded || canvasIds == null || username == null) {
    console.log(errorMessage);
    redirect('signin');
  }

  const { numberOfCanvases, errorMessage: getCanvasCountErrorMessage } = await getNumberOfCanvasesForSignedInUserServer();

  return (
    <main className="absolute flex flex-col m-6 md:m-8 lg:m-10">
      <p className="text-2xl">@{username}&apos; Studio</p>
      <div>Number of canvases you have: {numberOfCanvases ? numberOfCanvases : getCanvasCountErrorMessage}</div>
      <p className="text-lg mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5" >Your Gallery</p >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5 overflow-scroll mb-6">
        <Link className={`bg-gray-200 w-full aspect-square rounded-lg flex justify-center items-center hover:border-4 border-gray-500 
        text-gray-500 hover:text-gray-700`}
          href="/create"
          title="Create new canvas!">
          <PlusIcon className="w-1/2 h-1/2" />
        </Link>
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