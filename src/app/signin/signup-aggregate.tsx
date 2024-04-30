"use client";

import { useState } from "react";
import SignUpForm from "./signup-form";
import ConfirmSignUpForm from "./confirm-signup-form";

export default function SignUpAggregate({ setToSignIn }: { setToSignIn: () => void }) {
    const [userId, setUserId] = useState<null | string>(null);
    const [username, setUsername] = useState<null | string>(null);

    function updateUserIdHandler(newUserId: string | null) {
        setUserId(newUserId);
    }

    function updateUsernameHandler(newUsername: string | null) {
        setUsername(newUsername);
    }

    if (userId == null) {
        return <SignUpForm updateUserIdHandler={updateUserIdHandler} updateUsernameHandler={updateUsernameHandler} />;
    }
    return <ConfirmSignUpForm userId={userId} username={username} setToSignIn={setToSignIn} />;
}