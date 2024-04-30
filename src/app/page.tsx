import SignOutButton from "@/components/sign-out-button";
import { fetchUserAttributesServer } from "@/utils/amplify-utils";
import Link from "next/link";

export default async function App() {

  const currentUser = await fetchUserAttributesServer();
  const signedIn = currentUser != undefined;
  const username = currentUser?.preferred_username;

  function getSignInOutButton() {
    if (signedIn) {
      return (
        <SignOutButton />
      )
    } else {
      return (
        <Link href="/signin"
          className="bg-slate-600 h-10 rounded-md p-2 text-white hover:bg-slate-800">
          Sign in / Create account
        </Link>
      )
    }
  }

  return (
    <main className="h-screen flex flex-col">
      <div className="bg-slate-200 h-20 mb-4 p-4">
        {getSignInOutButton()}
      </div>
      <div className="bg-green-200 flex-grow flex justify-center items-center">
        <p className="text-2xl">{signedIn ? `Hi ${username}! Welcome to cubit!` : "Hello! Welcome to cubit!"}</p>
      </div>
    </main>
  );
}