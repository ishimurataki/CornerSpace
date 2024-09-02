"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
    ArrowRightIcon, ExclamationCircleIcon,
    LockClosedIcon, EyeIcon,
    LockOpenIcon
} from "@heroicons/react/24/solid";
import { z } from "zod";
import { useState } from "react";
import { updatePassword } from "aws-amplify/auth";

const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Must be at least 8 characters.")
        .refine((p) => /\d/.test(p), "Must contain at least 1 digit.")
        .refine((p) => /[a-z]/.test(p), "Must contain at least 1 lowercase letter.")
        .refine((p) => /[A-Z]/.test(p), "Must contain at least 1 uppercase letter.")
        .refine((p) => /[-+_!@#$%^&*.,?]/.test(p), "Must contain at least of the following symbols: [-+_!@#$%^&*.,?].")
});

type updatePasswordState = {
    updated: boolean;
    errors?: {
        newPassword?: string[];
    }
    message: string | null;
};

export default function UpdatePasswordForm() {
    const initialState: updatePasswordState = { updated: false, message: null, errors: undefined };
    const [updatePasswordFormState, updatePasswordDispatch] = useFormState(updatePasswordSubmit, initialState);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    async function updatePasswordSubmit(previousState: updatePasswordState, formData: FormData) {

        const validatedUpdatePasswordFields = resetPasswordSchema.safeParse({
            newPassword: formData.get("newPassword")
        });

        if (!validatedUpdatePasswordFields.success) {
            return {
                updated: false,
                errors: validatedUpdatePasswordFields.error.flatten().fieldErrors,
                message: "Field validations failed."
            }
        }

        const { newPassword } = validatedUpdatePasswordFields.data;
        const oldPassword = formData.get("oldPassword")?.toString();

        if (!oldPassword) {
            return {
                updated: false,
                message: "Old password must be provided."
            }
        }

        try {
            await updatePassword({
                oldPassword: oldPassword,
                newPassword: newPassword
            });
            return {
                updated: true,
                message: "Update successful."
            };
        } catch (err) {
            let message = "500 - Internal Server Error.";
            if (err instanceof Error) {
                message = err.message;
            }
            return {
                updated: false,
                message: message
            };
        }
    }
    return (
        <form action={updatePasswordDispatch} className="relative flex flex-col gap-2 w-72 h-full">
            <label htmlFor="oldPassword" className="relative text-gray-600 focus-within:text-black block">
                <LockOpenIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                <input
                    className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Old Password"
                    required
                />
                <EyeIcon className="hover:text-green-600 w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3"
                    onClick={() => setShowOldPassword(!showOldPassword)} />
            </label>
            <label htmlFor="newPassword" className="relative text-gray-600 focus-within:text-black block">
                <div className="relative">
                    <LockClosedIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                    <input
                        className="block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="New Password"
                        required
                    />
                    <EyeIcon className="hover:text-green-600 w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3"
                        onClick={() => setShowNewPassword(!showNewPassword)} />
                </div>
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {updatePasswordFormState.errors?.newPassword &&
                        updatePasswordFormState.errors.newPassword.map((error: string) => (
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
                {updatePasswordFormState.message && (
                    <>
                        <ExclamationCircleIcon className={`h-5 w-5 
                        ${updatePasswordFormState.updated ? "text-green-500" : "text-red-500"}`} />
                        <p className={`text-sm ${updatePasswordFormState.updated ? "text-green-500" : "text-red-500"}`}>
                            {updatePasswordFormState.message}
                        </p>
                    </>
                )}
            </div>
            <UpdatePasswordButton label="Confirm update password" />
        </form >
    );
}

function UpdatePasswordButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button className="mt-2 flex flex-row w-full bg-blue-400 rounded-lg p-1.5 text-white hover:font-bold 
            hover:bg-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:font-normal 
            aria-disabled:hover:bg-blue-400"
            aria-disabled={pending}>
            {label}<ArrowRightIcon className="ml-auto h-6 w-5 text-gray-50" />
        </button>
    );
}