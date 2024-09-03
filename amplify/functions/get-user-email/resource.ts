import { defineFunction } from '@aws-amplify/backend';

export const getUserEmail = defineFunction({
    name: 'get-user-email',
    entry: './handler.ts'
});