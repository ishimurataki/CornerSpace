"use server";

import Gallery from "@/app/studio/gallery";
import { doesUserExist, getBioAndEmailVisibilityServer } from "@/backend-lib/actions";
import { notFound } from "next/navigation";
import FollowButton from "./follow-button";
import UserEmail from "./user-email";
import { EnvelopeIcon, IdentificationIcon, UserIcon } from "@heroicons/react/24/solid";

export default async function UserPage({ params }: { params: { username: string } }) {
  const userExists = await doesUserExist(params.username);
  if (!userExists) {
    notFound();
  }
  const username = params.username;

  const userBioAndEmailVisibility = await getBioAndEmailVisibilityServer(username);

  return (
    <main className="flex flex-col m-6 md:m-8 lg:m-10 gap-2">

      <div className={`flex flex-col bg-green-100 rounded-lg divide-y-2 divide-white text-nowrap overflow-clip w-fit"}`}>
        <div className="px-4 py-2 bg-green-300">
          <div className="flex flex-row items-center gap-2">
            <UserIcon className="h-8" />
            <p className="text-2xl">@{username}</p>
            <FollowButton userToFollow={username} />
          </div>
        </div>
        {
          userBioAndEmailVisibility.bio &&
          <div className="px-4 py-2 bg-green-200">
            <div className="flex flex-row items-center gap-2">
              <IdentificationIcon className="h-4" />
              <div>Bio</div>
            </div>
            <p>{userBioAndEmailVisibility.bio}</p>
          </div>
        }
        {
          userBioAndEmailVisibility.emailVisbility &&
          <div className="px-4 py-2">
            <div className="flex flex-row items-center gap-2">
              <EnvelopeIcon className="h-4" />
              <div>Email</div>
            </div>
            <UserEmail username={username} />
          </div>
        }
      </div>
      <div className="flex flex-row gap-6 items-center mt-4">
        <p className="text-2xl">Gallery</p>
      </div>
      <Gallery forOwner={false} forUser={username} />
    </main >
  );
}