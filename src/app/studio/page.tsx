"use server";

import { redirect } from "next/navigation";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import Gallery from "./gallery";
import LikedCanvases from "./liked-canvases";
import Tabs from "./tabs";
import { Suspense } from "react";
import Following from "./following";
import Followers from "./followers";
import { getNumberOfCanvasesForSignedInUserServer } from "@/backend-lib/actions";
import Link from "next/link";

export default async function App() {

  const user = await fetchUserAttributesServer();
  const signedIn = user != undefined;
  const username = user?.preferred_username;

  if (!signedIn) {
    redirect('signin');
  }

  const { numberOfCanvases, errorMessage } = await getNumberOfCanvasesForSignedInUserServer();


  return (
    <main className="absolute flex flex-col m-6 md:m-8 lg:m-10 gap-2">
      <p className="text-2xl">@{username}&apos;s Studio</p>
      {
        numberOfCanvases && <div>
          {`You have ${numberOfCanvases} canvases available.`}
          <div className="text-sm text-gray-500">
            Upgrade your membership plan <Link href="/profile?profileTab=ChangeMembership" className="text-blue-600 hover:text-cyan-500">here</Link> to purchase more canvases.
          </div>
        </div>
      }
      <Tabs
        LikedCanvasServerComponent={
          <Suspense fallback={
            <div className={`bg-gray-200 w-full h-full rounded-lg`}>
            </div>}>
            <LikedCanvases />
          </Suspense>
        }
        GalleryServerComponent={
          <Suspense fallback={
            <div className={`bg-gray-200 w-full h-full rounded-lg`}>
            </div>}>
            <Gallery forOwner={true} forUser={null} />
          </Suspense>
        }
        FollowingServerComponent={
          <Suspense fallback={
            <div className={`bg-gray-200 w-full h-full rounded-lg`}>
            </div>}>
            <Following />
          </Suspense>
        }
        FollowersServerComponent={
          <Suspense fallback={
            <div className={`bg-gray-200 w-full h-full rounded-lg`}>
            </div>}>
            <Followers />
          </Suspense>
        }
      />
    </main >
  );
}