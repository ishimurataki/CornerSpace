"use server";

import Gallery from "@/app/studio/gallery";
import { doesUserExist, getBioServer } from "@/backend-lib/actions";
import { notFound } from "next/navigation";
import FollowButton from "./follow-button";

export default async function UserPage({ params }: { params: { username: string } }) {
  const userExists = await doesUserExist(params.username);
  if (!userExists) {
    notFound();
  }
  const username = params.username;

  const userBio = await getBioServer(username);

  return (
    <main className="flex flex-col m-6 md:m-8 lg:m-10 gap-2">
      <div className="flex flex-row gap-6 items-center">
        <p className="text-2xl">@{username}&apos; Gallery</p>
        <FollowButton userToFollow={username} />
      </div>
      {
        userBio.bio &&
        <div className="flex flex-row items-center gap-2">
          <p className="text-sm text-gray-500">Bio: </p>
          <p>{userBio.bio}</p>
        </div>
      }
      <Gallery forOwner={false} forUser={username} />
    </main >
  );
}