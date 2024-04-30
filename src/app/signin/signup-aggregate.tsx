'use client';

import { useState } from "react";
import SignUpForm from "./signup-form";
import ConfirmSignUpForm from "./confirm-signup-form";

export default function SignUpAggregate({ setToSignIn }: { setToSignIn: () => void }) {
    const [userId, setUserId] = useState<null | string>(null);

    function updateUserIdHandler(newUserId: string | null) {
        setUserId(newUserId);
    }

    if (userId == null) {
        return <SignUpForm updateUserIdHandler={updateUserIdHandler} />;
    }
    return <ConfirmSignUpForm userId={userId} setToSignIn={setToSignIn} />;
}