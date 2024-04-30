"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
    const [isSigningOut, setIsSigningOut] = useState(false);
    const router = useRouter()
    return (
        <button
            className="bg-slate-600 h-10 rounded-md p-2 text-white hover:bg-slate-800 
            aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:font-normal 
            aria-disabled:hover:bg-slate-600"
            aria-disabled={isSigningOut}
            onClick={async () => {
                setIsSigningOut(true);
                await signOut();
                router.refresh();
            }}>
            Sign Out
        </button>
    )
}