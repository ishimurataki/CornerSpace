import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { createCanvasForUser } from '../functions/create-canvas-for-user/resource';
import { deleteCanvasForUser } from '../functions/delete-canvas-for-user/resource';
import { getPublicCanvasIdsForUser } from '../functions/get-public-canvas-ids-for-user/resource';
import { getAllCanvasIdsForAuthenticatedUser } from '../functions/get-all-canvas-ids-for-authenticated-user/resource';
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
    deleteCanvasForUserResponse: a.customType({
      isCanvasDeleted: a.boolean().required(),
      errorMessage: a.string()
    }),
    deleteCanvasForUser: a
      .mutation()
      .arguments({ canvasId: a.string().required() })
      .authorization((allow) => [allow.authenticated()])
      .returns(a.ref('deleteCanvasForUserResponse'))
      .handler(a.handler.function(deleteCanvasForUser)),
    getCanvasIdsForUserResponse: a.customType({
      areCanvasIdsReturned: a.boolean().required(),
      canvasIds: a.string().required().array(),
      errorMessage: a.string()
    }),
    getPublicCanvasIdsForUser: a
      .query()
      .arguments({ ownerUsername: a.string().required() })
      .authorization((allow) => [allow.authenticated(), allow.guest()])
      .returns(a.ref('getCanvasIdsForUserResponse'))
      .handler(a.handler.function(getPublicCanvasIdsForUser)),
    getAllCanvasIdsForAuthenticatedUser: a
      .query()
      .arguments({ ownerUsername: a.string().required() })
      .authorization((allow) => [allow.authenticated()])
      .returns(a.ref('getCanvasIdsForUserResponse'))
      .handler(a.handler.function(getAllCanvasIdsForAuthenticatedUser)),
    canvasCard: a.customType({
      ownerUsername: a.string().required(),
      name: a.string().required(),
      description: a.string().required(),
      publicity: a.string().required(),
      thumbnail: a.string().required()
    }),
    getCanvasCardResponse: a.customType({
      isCanvasCardReturned: a.boolean().required(),
      canvasCard: a.ref('canvasCard'),
      errorMessage: a.string()
    }),
    getCanvasCard: a
      .query()
      .arguments({ canvasId: a.string().required() })
      .authorization((allow) => [allow.authenticated(), allow.guest()])
      .returns(a.ref('getCanvasCardResponse'))
      .handler(a.handler.function(getCanvasCard)),
    canvasData: a.customType({
      ownerUsername: a.string().required(),
      name: a.string().required(),
      description: a.string().required(),
      publicity: a.string().required(),
      canvasData: a.string().required()
    }),
    getCanvasDataResponse: a.customType({
      isCanvasDataReturned: a.boolean().required(),
      canvasData: a.ref('canvasData'),
      errorMessage: a.string()
    }),
    getCanvasData: a
      .query()
      .arguments({ canvasId: a.string().required() })
      .authorization((allow) => [allow.authenticated(), allow.guest()])
      .returns(a.ref('getCanvasDataResponse'))
      .handler(a.handler.function(getCanvasData))
  })
  .authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(createCanvasForUser),
    allow.resource(deleteCanvasForUser),
    allow.resource(getPublicCanvasIdsForUser),
    allow.resource(getAllCanvasIdsForAuthenticatedUser),
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