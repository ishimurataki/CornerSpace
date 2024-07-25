import { defineFunction } from '@aws-amplify/backend';

export const deleteCanvasForUser = defineFunction({
    name: 'delete-canvas-for-user',
    entry: './handler.ts'
});