"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
    EnvelopeIcon, ArrowRightIcon, ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { z } from "zod";
import { resendConfirmationCodeServer } from "@/backend-lib/actions";

const resendConfirmationSchema = z.object({
    email: z.string()
        .email("Must be of valid format")
});

type resendConfirmationState = {
    errors?: {
        email?: string[];
    };
    message?: string | null;
};

export default function ResendConfirmationForm({ updateUserIdHandler, updateShowResendConfirmationHandler }:
    {
        updateUserIdHandler: (newUserId: string | null) => void,
        updateShowResendConfirmationHandler: (show: boolean) => void
    }) {
    const initialState = { message: null, errors: undefined };
    const [resendConfirmationFormState, resendConfirmationDispatch] = useFormState(resendConfirmationSubmit, initialState);

    async function resendConfirmationSubmit(previousState: resendConfirmationState, formData: FormData) {

        const validatedResendConfirmationFields = resendConfirmationSchema.safeParse({
            email: formData.get("email"),
        });

        if (!validatedResendConfirmationFields.success) {
            return {
                errors: validatedResendConfirmationFields.error.flatten().fieldErrors,
                message: "Field validations failed."
            }
        }

        const { email } = validatedResendConfirmationFields.data;

        const { isConfirmationCodeResent, userId, errorMessage } = await resendConfirmationCodeServer(email);
        if (isConfirmationCodeResent && userId) {
            updateUserIdHandler(userId);
            return initialState;
        }
        return {
            message: errorMessage
        };
    }
    return (
        <div>
            <form action={resendConfirmationDispatch} className="flex flex-col gap-4 w-72">
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
                        {resendConfirmationFormState.errors?.email &&
                            resendConfirmationFormState.errors.email.map((error: string) => (
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
                    {resendConfirmationFormState.message && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{resendConfirmationFormState.message}</p>
                        </>
                    )}
                </div>
                <ResendConfirmationButton label="Resend Code" />
            </form >
            <button className="absolute bottom-0 right-0 mb-2 mr-4 text-sm underline" onClick={() => {
                updateShowResendConfirmationHandler(false);
            }}>
                Go back
            </button>
        </div>
    );
}

function ResendConfirmationButton({ label }: { label: string }) {
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