import { defineFunction } from '@aws-amplify/backend';

export const changeBioForUser = defineFunction({
    name: 'change-bio-for-user',
    entry: './handler.ts'
});