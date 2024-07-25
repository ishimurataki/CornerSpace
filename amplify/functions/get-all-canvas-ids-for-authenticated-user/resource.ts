import { defineFunction } from '@aws-amplify/backend';

export const getAllCanvasIdsForAuthenticatedUser = defineFunction({
    name: 'get-all-canvas-ids-for-authenticated-user',
    entry: './handler.ts'
});