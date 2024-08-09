"use server";

import Gallery from "@/app/studio/gallery";
import { doesUserExist } from "@/backend-lib/actions";
import { notFound } from "next/navigation";

export default async function UserPage({ params }: { params: { username: string } }) {
  const userExists = await doesUserExist(params.username);
  if (!userExists) {
    notFound();
  }
  const username = params.username;

  return (
    <main className="flex flex-col m-6 md:m-8 lg:m-10">
      <p className="text-2xl">@{username}&apos; Gallery</p>
      <Gallery forOwner={false} forUser={username} />
    </main >
  );
}