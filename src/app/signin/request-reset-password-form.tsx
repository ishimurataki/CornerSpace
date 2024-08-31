"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
    EnvelopeIcon, ArrowRightIcon, ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { z } from "zod";
import { requestResetPasswordServer } from "@/backend-lib/actions";

const resetPasswordSchema = z.object({
    email: z.string()
        .email("Must be of valid format")
});

type resetPasswordState = {
    errors?: {
        email?: string[];
    };
    message?: string | null;
};

export default function RequestResetPasswordForm({ changeToResetPassword, changeToSignIn }:
    {
        changeToResetPassword: (userEmail: string) => void,
        changeToSignIn: () => void
    }) {
    const initialState = { message: null, errors: undefined };
    const [resetPasswordFormState, resetPasswordDispatch] = useFormState(resetPasswordSubmit, initialState);

    async function resetPasswordSubmit(previousState: resetPasswordState, formData: FormData) {

        const validatedSignUpFields = resetPasswordSchema.safeParse({
            email: formData.get("email"),
        });

        if (!validatedSignUpFields.success) {
            return {
                errors: validatedSignUpFields.error.flatten().fieldErrors,
                message: "Field validations failed."
            }
        }

        const { email } = validatedSignUpFields.data;

        const { isPasswordResetInitiated, errorMessage } = await requestResetPasswordServer(email);
        if (isPasswordResetInitiated) {
            changeToResetPassword(email);
            return initialState;
        }
        return {
            message: errorMessage
        };
    }
    return (
        <div>
            <form action={resetPasswordDispatch} className="flex flex-col gap-4 w-72">
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
                        {resetPasswordFormState.errors?.email &&
                            resetPasswordFormState.errors.email.map((error: string) => (
                                <p className="mt-2 -mb-2 text-xs text-red-500" key={error}>
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
                <ResetPasswordButton label="Reset Password" />
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