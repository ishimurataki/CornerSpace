import { defineFunction } from "@aws-amplify/backend";

export const resendConfirmationCode = defineFunction({
    name: 'resend-confirmation-code',
    entry: './handler.ts'
});