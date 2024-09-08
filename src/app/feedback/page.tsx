"use server";

import Link from "next/link";

export default async function FeedbackPage() {

    return (
        <main className="absolute flex flex-col my-5 md:my-10 mx-10 md:mx-40 gap-2 pb-20">
            <h1 className="text-3xl">Feedback for CornerSpace</h1>
            <hr className="bg-gray-500" />
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfZESd3k3T_ywCua7KrI7V7TR4sSPl5mV-K1tYnmQapCRm8vA/viewform?embedded=true" width="640" height="1182" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
        </main>
    );
}