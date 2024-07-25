import { defineFunction } from '@aws-amplify/backend';

export const getPublicCanvasIdsForUser = defineFunction({
    name: 'get-public-canvas-ids-for-user',
    entry: './handler.ts'
});