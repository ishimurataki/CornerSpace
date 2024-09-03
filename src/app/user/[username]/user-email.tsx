"use server";

import { getUserEmailServer } from "@/backend-lib/actions";

export default async function UserEmail({ username }: { username: string }) {
    const { isEmailReturned, email, errorMessage } = await getUserEmailServer(username);

    if (isEmailReturned && email) {
        return (
            <div className="flex flex-row items-center gap-2">
                <p>{email}</p>
            </div>
        )
    }
    return <div>{errorMessage}</div>
}