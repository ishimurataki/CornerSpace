import { defineFunction } from '@aws-amplify/backend';

export const likeCanvasForUser = defineFunction({
    name: 'like-canvas-for-user',
    entry: './handler.ts'
});