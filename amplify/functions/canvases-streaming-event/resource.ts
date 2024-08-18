import { defineFunction } from "@aws-amplify/backend";

export const canvasesStreamingEvent = defineFunction({
    name: 'canvases-streaming-event',
    entry: './handler.ts'
});