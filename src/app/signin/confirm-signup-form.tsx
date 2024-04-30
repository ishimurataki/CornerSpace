'use client';

import { AuthError, confirmSignUp, signUp } from "aws-amplify/auth";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowRightIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ConfirmSignUpForm({ userId, setToSignIn }: { userId: string | null, setToSignIn: () => void }) {
    const [errorMessage, confirmSignUpDispatch] = useFormState(confirmSignUpSubmit, null);

    async function confirmSignUpSubmit(previousState: string | null, formData: FormData) {
        const confirmationCode = formData.get("confirmationCode")?.toString();
        if (!userId || !confirmationCode) return "Provide userId and confirmation code.";
        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: userId,
                confirmationCode
            });
            if (isSignUpComplete) setToSignIn();
            return null;
        } catch (error) {
            if (error instanceof AuthError) {
                return error.message;
            } else {
                return "Something went wrong.";
            }
        }
    }

    return (
        <form action={confirmSignUpDispatch} className="flex flex-col gap-4 w-60">
            <label htmlFor="confirmationCode" className="relative text-gray-600 focus-within:text-black block">
                <CheckCircleIcon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                <input
                    className="block rounded-lg border w-full border-gray-200 p-2 text-sm outline-2 placeholder:text-gray-500 pl-12"
                    id="confirmationCode"
                    type="confirmationCode"
                    name="confirmationCode"
                    placeholder="Confirmation Code"
                    defaultValue=""
                    required
                />
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
            <SignUpButton label="Confirm Sign Up" />
        </form>
    )
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