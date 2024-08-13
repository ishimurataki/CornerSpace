"use server";

import Gallery from "@/app/studio/gallery";
import { doesUserExist } from "@/backend-lib/actions";
import { notFound } from "next/navigation";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import FollowButton from "./follow-button";

export default async function UserPage({ params }: { params: { username: string } }) {
  const userExists = await doesUserExist(params.username);
  if (!userExists) {
    notFound();
  }
  const username = params.username;

  return (
    <main className="flex flex-col m-6 md:m-8 lg:m-10">
      <div className="flex flex-row gap-6 items-center">
        <p className="text-2xl">@{username}&apos; Gallery</p>
        <FollowButton userToFollow={username} />
      </div>
      <Gallery forOwner={false} forUser={username} />
    </main >
  );
}