'use server';

import Link from "next/link";
import CanvasesTabs from "./home/canvases-tabs";
import NewCanvases from "./home/new-canvases";
import PopularCanvases from "./home/popular-canvases";

export default async function App() {

  return (
    <main className="absolute flex flex-col mt-4 ml-6 mr-4 md:mt-10 md:ml-16 md:mr-10 gap-1">
      <h1 className="text-4xl">Welcome to Cubit!</h1>
      <p>Glad you&apos;ve made it. Here, you can create and share voxel art to your heart&apos;s desire.</p>

      <h1 className="text-3xl pt-2">Create</h1>
      <p>Ready to start creating? Get started on a new canvas <Link
        href="/create" className="text-blue-600 hover:bg-orange-300 rounded-md p-1 text-xl">here</Link>!
      </p>

      <h1 className="text-3xl pt-2">Explore</h1>
      <p>Care to explore? Check out some of the popular or new canvases folks have created here!</p>
      <CanvasesTabs
        PopularCanvasesServerComponent={<PopularCanvases />}
        NewCanvasesServerComponent={<NewCanvases />}
      />
    </main>
  );
}