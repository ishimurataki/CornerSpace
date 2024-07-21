import { defineStorage } from '@aws-amplify/backend';
import { createCanvasForUser } from '../functions/create-canvas-for-user/resource'

export const storage = defineStorage({
    name: 'canvases',
    access: (allow) => ({
        'canvases/{entity_id}/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read']),
            allow.resource(createCanvasForUser).to(['write'])
        ],
        'canvasThumbnails/{entity_id}/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read']),
            allow.resource(createCanvasForUser).to(['write'])
        ]
    })
});