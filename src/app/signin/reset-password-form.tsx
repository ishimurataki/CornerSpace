"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
    CheckCircleIcon, ArrowRightIcon, ExclamationCircleIcon,
    LockClosedIcon, EyeIcon
} from "@heroicons/react/24/solid";
import { z } from "zod";
import { resetPasswordServer } from "@/backend-lib/actions";
import { useState } from "react";

const resetPasswordSchema = z.object({
    email: z.string()
        .email("Must be of valid format"),
    newPassword: z.string()
        .min(8, "Must be at least 8 characters.")
        .refine((p) => /\d/.test(p), "Must contain at least 1 digit.")
        .refine((p) => /[a-z]/.test(p), "Must contain at least 1 lowercase letter.")
        .refine((p) => /[A-Z]/.test(p), "Must contain at least 1 uppercase letter.")
        .refine((p) => /[-+_!@#$%^&*.,?]/.test(p), "Must contain at least of the following symbols: [-+_!@#$%^&*.,?].")
});

type resetPasswordState = {
    errors?: {
        email?: string[];
        newPassword?: string[];
    };
    message?: string | null;
};

export default function ResetPasswordForm({ userEmail, changeToSignIn }:
    {
        userEmail: string,
        changeToSignIn: () => void
    }) {
    const initialState = { message: null, errors: undefined };
    const [resetPasswordFormState, resetPasswordDispatch] = useFormState(resetPasswordSubmit, initialState);
    const [showPassword, setShowPassword] = useState(false);

    async function resetPasswordSubmit(previousState: resetPasswordState, formData: FormData) {

        const validatedSignUpFields = resetPasswordSchema.safeParse({
            email: userEmail,
            newPassword: formData.get("newPassword")
        });

        if (!validatedSignUpFields.success) {
            return {
                errors: validatedSignUpFields.error.flatten().fieldErrors,
                message: "Field validations failed."
            }
        }

        const { email, newPassword } = validatedSignUpFields.data;
        const confirmationCode = formData.get("confirmationCode")?.toString();

        if (!confirmationCode) return {
            message: "No confirmation code provded."
        }

        const { isPasswordReset, errorMessage } = await resetPasswordServer(email, confirmationCode, newPassword);
        if (isPasswordReset) {
            changeToSignIn();
            return initialState;
        }
        return {
            message: errorMessage
        };
    }
    return (
        <div>
            <form action={resetPasswordDispatch} className="flex flex-col gap-4 w-72">
                <label htmlFor="confirmationCode" className="relative text-gray-600 focus-within:text-black block">
                    <CheckCircleIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                    <input
                        className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                        id="confirmationCode"
                        type="confirmationCode"
                        name="confirmationCode"
                        placeholder="Confirmation Code"
                        defaultValue=""
                        required
                    />
                </label>
                <label htmlFor="newPassword" className="relative text-gray-600 focus-within:text-black block">
                    <div className="relative">
                        <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                            className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="New Password"
                        />
                        <EyeIcon className="hover:text-green-600 w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3"
                            onClick={() => setShowPassword(!showPassword)} />
                    </div>
                    <div id="password-error" aria-live="polite" aria-atomic="true">
                        {resetPasswordFormState.errors?.newPassword &&
                            resetPasswordFormState.errors.newPassword.map((error: string) => (
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
                    {resetPasswordFormState.message && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{resetPasswordFormState.message}</p>
                        </>
                    )}
                </div>
                <ResetPasswordButton label="Confirm Reset Password" />
            </form >
            <button className="absolute bottom-0 left-0 mb-2 ml-4 text-sm underline" onClick={() => {
                changeToSignIn();
            }}>
                Go back
            </button>
        </div>
    );
}

function ResetPasswordButton({ label }: { label: string }) {
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