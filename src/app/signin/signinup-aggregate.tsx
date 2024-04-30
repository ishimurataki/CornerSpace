"use client";

import { useState } from "react"
import SignInForm from "./signin-form";
import SignUpAggregate from "./signup-aggregate";

enum Mode {
    SignIn = "signIn",
    SignUp = "signUp"
}

export default function SignInUpAggregate() {
    const [mode, setMode] = useState<Mode>(Mode.SignIn);
    return (
        <div className="relative w-2/3 max-w-2xl min-w-fit mx-auto flex flex-row h-100">
            <div className="flex flex-col gap-6 w-1/2 bg-green-400 rounded-l-2xl py-10 px-6">
                <text className="text-xl text-white font-extrabold">Sign In</text>
                <SignInForm />
            </div>
            <div className="flex flex-col gap-6 w-1/2 bg-green-400 rounded-r-2xl py-10 px-6">
                <text className="text-xl text-white font-extrabold">Sign Up</text>
                <SignUpAggregate setToSignIn={() => setMode(Mode.SignIn)} />
            </div>
            <div className={`absolute flex flex-col gap-4 bg-white/50 w-1/2 h-full backdrop-blur-md z-50 rounded-l-2xl p-10
                        ${mode === Mode.SignUp ? "visible" : "invisible"}`}>
                <text className="text-2xl">Already have an account?</text>
                <button
                    className="flex flex-row bg-blue-400 rounded-lg p-1.5 text-white hover:font-bold hover:bg-blue-500"
                    onClick={() => { setMode(Mode.SignIn) }}>
                    Let's get you signed in!
                </button>
            </div>
            <div className={`absolute flex flex-col gap-4 bg-white/50 w-1/2 h-full left-1/2 backdrop-blur-md z-50 rounded-r-2xl p-10
                        ${mode === Mode.SignIn ? "visible" : "invisible"}`}>
                <text className="text-2xl">Don't have an account?</text>
                <button
                    className="flex flex-row bg-blue-400 rounded-lg p-1.5 text-white hover:font-bold hover:bg-blue-500"
                    onClick={() => { setMode(Mode.SignUp) }}>
                    Let's get you signed up!
                </button>
            </div>
        </div>
    )
}