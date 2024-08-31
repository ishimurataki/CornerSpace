"use client";

import { useRef, useState } from "react";
import SignInForm from "./signin-form";
import RequestResetPasswordForm from "./request-reset-password-form";
import ResetPasswordForm from "./reset-password-form";

enum SignInAggregateStates {
    SignIn,
    RequestResetPassword,
    ResetPassword
}

export default function SignInAggregate() {
    const userEmailRef = useRef<string | null>(null);
    const [signInAggregateState, setSignInAggregateState] = useState<SignInAggregateStates>(SignInAggregateStates.SignIn);

    function changeToRequestResetPassword() {
        setSignInAggregateState(SignInAggregateStates.RequestResetPassword);
    }

    function changeToSignIn() {
        setSignInAggregateState(SignInAggregateStates.SignIn);
    }

    function changeToResetPassword(userEmail: string) {
        userEmailRef.current = userEmail;
        setSignInAggregateState(SignInAggregateStates.ResetPassword);
    }

    if (signInAggregateState === SignInAggregateStates.RequestResetPassword) {
        return <RequestResetPasswordForm
            changeToResetPassword={changeToResetPassword}
            changeToSignIn={changeToSignIn}
        />
    }
    if (signInAggregateState === SignInAggregateStates.ResetPassword) {
        return <ResetPasswordForm
            userEmail={userEmailRef.current ? userEmailRef.current : ""}
            changeToSignIn={changeToSignIn}
        />
    }
    return <SignInForm changeToRequestResetPassword={changeToRequestResetPassword} />
}