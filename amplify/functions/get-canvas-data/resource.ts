import { defineFunction } from '@aws-amplify/backend';

export const getCanvasData = defineFunction({
    name: 'get-canvas-data',
    entry: './handler.ts'
});