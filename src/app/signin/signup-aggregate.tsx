"use client";

import { useState } from "react";
import SignUpForm from "./signup-form";
import ConfirmSignUpForm from "./confirm-signup-form";
import ResendConfirmationForm from "./resend-confirmation-form";

export default function SignUpAggregate({ setToSignIn }: { setToSignIn: () => void }) {
    const [userId, setUserId] = useState<null | string>(null);
    const [showResendConfirmation, setShowResendConfirmation] = useState(false);

    function updateUserIdHandler(newUserId: string | null) {
        setShowResendConfirmation(false);
        setUserId(newUserId);
    }

    function updateShowResendConfirmationHandler(show: boolean) {
        setShowResendConfirmation(show);
    }

    if (showResendConfirmation) {
        return <ResendConfirmationForm
            updateUserIdHandler={updateUserIdHandler}
            updateShowResendConfirmationHandler={updateShowResendConfirmationHandler}
        />
    }
    if (userId == null) {
        return <SignUpForm
            updateUserIdHandler={updateUserIdHandler}
            updateShowResendConfirmationHandler={updateShowResendConfirmationHandler}
        />;
    }
    return <ConfirmSignUpForm userId={userId} setToSignIn={setToSignIn} />;
}