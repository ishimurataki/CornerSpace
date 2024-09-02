"use client";

import { useFormState, useFormStatus } from "react-dom";
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon, ArrowRightIcon, EyeIcon } from "@heroicons/react/24/solid";
import { AuthError, signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInForm({ changeToRequestResetPassword }:
    {
        changeToRequestResetPassword: () => void,
    }) {
    const [errorMessage, signInDispatch] = useFormState(signInSubmit, null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function signInSubmit(previousState: string | null, formData: FormData) {
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        if (!email || !password) return "Provide both email and password.";
        try {
            await signIn({ username: email, password });
            router.refresh();
            return null;
        } catch (error) {
            if (error instanceof AuthError) {
                return error.message;
            } else {
                return "500 - Internal Server Error.";
            }
        }
    }

    return (
        <div>
            <form action={signInDispatch} className="flex flex-col gap-4 w-72">
                <label htmlFor="email" className="relative text-gray-600 focus-within:text-black block">
                    <EnvelopeIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                    <input
                        className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                    />
                </label>
                <label htmlFor="password" className="relative text-gray-600 focus-within:text-black block">
                    <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                    <input
                        className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                    />
                    <EyeIcon className="hover:text-green-600 w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3"
                        onClick={() => setShowPassword(!showPassword)} />
                </label>
                <div className="flex items-start space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500 w-56">{errorMessage}</p>
                        </>
                    )}
                </div>
                <SignInButton />
            </form>
            <button className="absolute bottom-0 left-0 mb-2 ml-4 text-sm underline" onClick={() => {
                changeToRequestResetPassword();
            }}>
                Forgot password?
            </button>
        </div>
    );
}

function SignInButton() {
    const { pending } = useFormStatus();
    return (
        <button className="flex flex-row w-full bg-blue-400 rounded-lg p-1.5 text-white hover:font-bold 
            hover:bg-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:font-normal 
            aria-disabled:hover:bg-blue-400"
            aria-disabled={pending}>
            Sign In <ArrowRightIcon className="ml-auto h-6 w-5 text-gray-50" />
        </button>
    );
}

