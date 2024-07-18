import { defineFunction } from '@aws-amplify/backend';

export const createCanvasForUser = defineFunction({
    name: 'create-canvas-for-user',
    entry: './handler.ts'
});