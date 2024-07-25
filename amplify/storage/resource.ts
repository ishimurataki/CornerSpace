import { defineStorage } from '@aws-amplify/backend';
import { createCanvasForUser } from '../functions/create-canvas-for-user/resource'
import { getCanvasCard } from '../functions/get-canvas-card/resource';
import { getCanvasData } from '../functions/get-canvas-data/resource';

export const storage = defineStorage({
    name: 'canvases',
    access: (allow) => ({
        'canvases/{entity_id}/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read']),
            allow.resource(createCanvasForUser).to(['write']),
            allow.resource(getCanvasData).to(['read'])
        ],
        'canvasThumbnails/{entity_id}/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read']),
            allow.resource(createCanvasForUser).to(['write']),
            allow.resource(getCanvasCard).to(['read'])
        ]
    })
});