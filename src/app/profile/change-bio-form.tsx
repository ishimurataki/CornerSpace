"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
    ArrowRightIcon, ExclamationCircleIcon
} from "@heroicons/react/24/solid";
import { z } from "zod";
import { changeBioServer } from "@/backend-lib/actions";
import { useState } from "react";
import { USER_BIO_MAXIMUM_LENGTH } from "../../../amplify/constants";

const changeBioSchema = z.object({
    newBio: z.string()
        .max(USER_BIO_MAXIMUM_LENGTH, `Bio can be at most ${USER_BIO_MAXIMUM_LENGTH} characters.`)
});

type changeBioState = {
    changed: boolean;
    errors?: {
        newBio?: string[];
    }
    message: string | null;
};

export default function ChangeBioForm({ oldBio }: { oldBio: string | null }) {
    const initialState: changeBioState = { changed: false, errors: undefined, message: null };
    const [changeBioFormState, changeBioDispatch] = useFormState(changeBioSubmit, initialState);
    const [characterCount, setCharacterCount] = useState(oldBio ? oldBio.length : 0);

    async function changeBioSubmit(previousState: changeBioState, formData: FormData) {

        const validatedChangeBioFields = changeBioSchema.safeParse({
            newBio: formData.get("newBio")
        });

        if (!validatedChangeBioFields.success) {
            return {
                changed: false,
                errors: validatedChangeBioFields.error.flatten().fieldErrors,
                message: "Field validations failed."
            }
        }

        const { newBio } = validatedChangeBioFields.data;

        const { isBioChanged, errorMessage } = await changeBioServer(newBio);
        if (!errorMessage) {
            return {
                changed: isBioChanged,
                message: "Bio updated successfully!"
            }
        }
        return {
            changed: false,
            message: errorMessage
        }
    }
    return (
        <form action={changeBioDispatch} className="relative flex flex-col gap-2 w-full h-full">
            <label htmlFor="newBio" className="relative text-gray-600 focus-within:text-black grow flex flex-col">
                <textarea
                    className="grow block rounded-lg w-full p-2 text-sm outline-2 placeholder:text-gray-500"
                    id="newBio"
                    name="newBio"
                    placeholder="Write your bio here..."
                    onChange={(e) => {
                        const newCharacterCount = e.target.value.length;
                        if (newCharacterCount > USER_BIO_MAXIMUM_LENGTH) {
                            e.target.value = e.target.value.substring(0, USER_BIO_MAXIMUM_LENGTH);
                        }
                        setCharacterCount(e.target.value.length);
                    }}
                >{oldBio}</textarea>
                <div id="new-bio-error" aria-live="polite" aria-atomic="true">
                    {changeBioFormState.errors?.newBio &&
                        changeBioFormState.errors.newBio.map((error: string) => (
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
                {changeBioFormState.message && (
                    <>
                        <ExclamationCircleIcon className={`h-5 w-5 
                        ${changeBioFormState.changed ? "text-green-500" : "text-red-500"}`} />
                        <p className={`text-sm ${changeBioFormState.changed ? "text-green-500" : "text-red-500"}`}>
                            {changeBioFormState.message}
                        </p>
                    </>
                )}
            </div>

            <div className="text-xs text-gray-500 absolute bottom-0 right-0">
                {`${USER_BIO_MAXIMUM_LENGTH - characterCount} / ${USER_BIO_MAXIMUM_LENGTH} characters remaining`}
            </div>

            <ChangeBioButton label="Update bio" />
        </form >
    );
}

function ChangeBioButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button className="mt-2 flex flex-row gap-2 w-fit bg-blue-400 rounded-lg p-1.5 text-white hover:font-bold 
            hover:bg-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:font-normal 
            aria-disabled:hover:bg-blue-400"
            aria-disabled={pending}>
            {label}<ArrowRightIcon className="ml-auto h-6 w-5 text-gray-50" />
        </button>
    );
}