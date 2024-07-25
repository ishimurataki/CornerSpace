import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { createCanvasForUser } from '../functions/create-canvas-for-user/resource'
import { getPublicCanvasIdsForUser } from '../functions/get-public-canvas-ids-for-user/resource';
import { getCanvasCard } from '../functions/get-canvas-card/resource';
import { getCanvasData } from '../functions/get-canvas-data/resource';

const schema = a
  .schema({
    Users: a
      .model({
        username: a.id().required()
          .authorization((allow) => [
            allow.guest().to(["read"]),
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        cognitoId: a.string()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        numberOfCanvases: a.integer().default(3)
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ])
      })
      .authorization(allow => [
        allow.guest().to(["read"]),
      ])
      .identifier(["username"]),
    Canvases: a
      .model({
        ownerUsername: a.id().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        ownerCognitoId: a.string()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        canvasId: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        name: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read", "update"])
          ]),
        description: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read", "update"])
          ]),
        publicity: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read", "update"])
          ]),
      })
      .identifier(["ownerUsername", "canvasId"])
      .secondaryIndexes((index) => [index("canvasId")])
      .authorization(allow => [
        allow.ownerDefinedIn("ownerCognitoId").to(["read"])
      ]),
    getCanvasesForUser: a
      .query()
      .arguments({ user: a.string().required() })
      .returns(a.ref("Canvases").array())
      .authorization(allow => [allow.publicApiKey()])
      .handler(a.handler.custom({
        dataSource: a.ref("Canvases"),
        entry: "./get-canvases-for-user.js"
      })),
    createCanvasForUserResponse: a.customType({
      isCanvasSaved: a.boolean().required(),
      canvasId: a.string(),
      errorMessage: a.string()
    }),
    createCanvasForUser: a
      .mutation()
      .arguments({
        ownerUsername: a.string().required(),
        canvasId: a.string(),
        name: a.string().required(),
        description: a.string().required(),
        publicity: a.string().required(),
        canvasData: a.string().required(),
        canvasThumbail: a.string().required()
      })
      .authorization((allow) => [allow.authenticated()])
      .returns(a.ref('createCanvasForUserResponse'))
      .handler(a.handler.function(createCanvasForUser)),
    getPublicCanvasIdsForUserResponse: a.customType({
      areCanvasIdsReturned: a.boolean().required(),
      canvasIds: a.string().array(),
      errorMessage: a.string()
    }),
    getPublicCanvasIdsForUser: a
      .query()
      .arguments({ ownerUsername: a.string().required() })
      .authorization((allow) => [allow.authenticated(), allow.guest()])
      .returns(a.ref('getPublicCanvasIdsForUserResponse'))
      .handler(a.handler.function(getPublicCanvasIdsForUser)),
    getCanvasCardResponse: a.customType({
      isCanvasCardReturned: a.boolean().required(),
      ownerUsername: a.string().required(),
      name: a.string().required(),
      description: a.string().required(),
      publicity: a.string().required(),
      thumbnail: a.string().required(),
      errorMessage: a.string()
    }),
    getCanvasCard: a
      .query()
      .arguments({ ownerUsername: a.string().required(), canvasId: a.string().required() })
      .authorization((allow) => [allow.authenticated(), allow.guest()])
      .returns(a.ref('getCanvasCardResponse'))
      .handler(a.handler.function(getCanvasCard)),
    getCanvasDataResponse: a.customType({
      isCanvasDataReturned: a.boolean().required(),
      canvasData: a.customType({
        ownerUsername: a.string().required(),
        name: a.string().required(),
        description: a.string().required(),
        publicity: a.string().required(),
        canvasData: a.string().required()
      }),
      errorMessage: a.string()
    }),
    getCanvasData: a
      .query()
      .arguments({ ownerUsername: a.string().required(), canvasId: a.string().required() })
      .authorization((allow) => [allow.authenticated(), allow.guest()])
      .returns(a.ref('getCanvasDataResponse'))
      .handler(a.handler.function(getCanvasData)),
  })
  .authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(createCanvasForUser),
    allow.resource(getPublicCanvasIdsForUser),
    allow.resource(getCanvasCard),
    allow.resource(getCanvasData)
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});