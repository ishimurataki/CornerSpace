import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'canvases',
    access: (allow) => ({
        'canvases/{entity_id}/*': [allow.guest.to(['read', 'write'])],
        'canvasThumbnails/{entity_id}/*': [allow.guest.to(['read', 'write'])]
    })
});