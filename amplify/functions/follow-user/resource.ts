import { defineFunction } from '@aws-amplify/backend';

export const followUser = defineFunction({
    name: 'follow-user',
    entry: './handler.ts'
});