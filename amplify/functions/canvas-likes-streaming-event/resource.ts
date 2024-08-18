import { defineFunction } from "@aws-amplify/backend";

export const canvasLikesStreamingEvent = defineFunction({
    name: 'canvas-likes-streaming-event',
    entry: './handler.ts'
});