"use server";

import CanvasCard from "./canvas-card";
import { getCanvasIdsForUserServer } from "@/backend-lib/actions";
import { notFound } from "next/navigation";

export default async function App() {

  const { areCanvasIdsLoaded, canvasIds, errorMessage } = await getCanvasIdsForUserServer();
  if (!areCanvasIdsLoaded || canvasIds == null) {
    console.log(errorMessage);
    notFound();
  }

  return (
    <main className="h-screen flex flex-col bg-green-50 p-10">
      <p className="text-2xl">Hello! Welcome to cubit</p>
      <p className="text-lg mx-10 mt-5">Your canvases!</p>
      <div className="grid grid-cols-1 gap-4 mx-10 my-5 overflow-scroll">
        {canvasIds.map((canvasId) => {
          return <CanvasCard canvasId={canvasId} />
        })}
      </div>
    </main>
  );
}