"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
    UserCircleIcon, LockClosedIcon, EnvelopeIcon, ArrowRightIcon, ExclamationCircleIcon,
    EyeIcon
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { z } from "zod";
import { signUpServer } from "@/backend-lib/actions";

const signUpSchema = z.object({
    username: z.string()
        .min(4, "Must be at least 4 characters."),
    email: z.string()
        .email("Must be of valid format"),
    password: z.string()
        .min(8, "Must be at least 8 characters.")
        .refine((p) => /\d/.test(p), "Must contain at least 1 digit.")
        .refine((p) => /[a-z]/.test(p), "Must contain at least 1 lowercase letter.")
        .refine((p) => /[A-Z]/.test(p), "Must contain at least 1 uppercase letter.")
        .refine((p) => /[-+_!@#$%^&*.,?]/.test(p), "Must contain at least of the following symbols: [-+_!@#$%^&*.,?].")
});

type signUpState = {
    errors?: {
        username?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
};

export default function SignUpForm({ updateUserIdHandler, updateShowResendConfirmationHandler }:
    {
        updateUserIdHandler: (newUserId: string | null) => void,
        updateShowResendConfirmationHandler: (show: boolean) => void,
    }) {
    const initialState = { message: null, errors: undefined };
    const [signUpFormState, signUpDispatch] = useFormState(signUpSubmit, initialState);
    const [showPassword, setShowPassword] = useState(false);

    async function signUpSubmit(previousState: signUpState, formData: FormData) {

        const validatedSignUpFields = signUpSchema.safeParse({
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password")
        });

        if (!validatedSignUpFields.success) {
            return {
                errors: validatedSignUpFields.error.flatten().fieldErrors,
                message: "Field validations failed."
            }
        }

        const { username, email, password } = validatedSignUpFields.data;

        const { isSignedUp, userId, errorMessage } = await signUpServer(username, email, password);
        if (isSignedUp && userId && username) {
            updateUserIdHandler(userId);
            return initialState;
        }
        return {
            message: errorMessage
        };
    }
    return (
        <div>
            <form action={signUpDispatch} className="flex flex-col gap-4 w-72">
                <label htmlFor="username" className="relative text-gray-600 focus-within:text-black block" >
                    <div className="relative">
                        <UserCircleIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                            className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                            id="username"
                            type="username"
                            name="username"
                            placeholder="Username"
                        />
                    </div>
                    <div id="username-error" aria-live="polite" aria-atomic="true">
                        {signUpFormState.errors?.username &&
                            signUpFormState.errors.username.map((error: string) => (
                                <p className="mt-2 -mb-2 text-xs text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </label >
                <label htmlFor="email" className="relative text-gray-600 focus-within:text-black block">
                    <div className="relative">
                        <EnvelopeIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                            className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                            id="email"
                            name="email"
                            placeholder="Email"
                        />
                    </div>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {signUpFormState.errors?.email &&
                            signUpFormState.errors.email.map((error: string) => (
                                <p className="mt-2 -mb-2 text-xs text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </label>
                <label htmlFor="password" className="relative text-gray-600 focus-within:text-black block">
                    <div className="relative">
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
                    </div>
                    <div id="password-error" aria-live="polite" aria-atomic="true">
                        {signUpFormState.errors?.password &&
                            signUpFormState.errors.password.map((error: string) => (
                                <p className="mt-2 -mb-2 text-xs text-red-500 mr-10" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </label>
                <div className="flex items-start space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {signUpFormState.message && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{signUpFormState.message}</p>
                        </>
                    )}
                </div>
                <SignUpButton label="Sign Up" />
            </form >
            <button className="absolute bottom-0 right-0 mb-2 mr-4 text-sm underline" onClick={() => {
                updateShowResendConfirmationHandler(true);
            }}>
                Resend confirmation?
            </button>
        </div>
    );
}

function SignUpButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button className="flex flex-row w-full bg-blue-400 rounded-lg p-1.5 text-white hover:font-bold 
            hover:bg-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:font-normal 
            aria-disabled:hover:bg-blue-400"
            aria-disabled={pending}>
            {label}<ArrowRightIcon className="ml-auto h-6 w-5 text-gray-50" />
        </button>
    );
}