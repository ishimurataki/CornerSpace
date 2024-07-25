import { defineFunction } from '@aws-amplify/backend';

export const getCanvasCard = defineFunction({
    name: 'get-canvas-card',
    entry: './handler.ts'
});