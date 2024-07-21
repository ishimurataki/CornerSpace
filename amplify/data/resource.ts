import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { createCanvasForUser } from '../functions/create-canvas-for-user/resource'

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
            allow.guest().to(["read"]),
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        ownerCognitoId: a.string()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        canvasId: a.string().required()
          .authorization((allow) => [
            allow.guest().to(["read"]),
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        name: a.string().required()
          .authorization((allow) => [
            allow.guest().to(["read"]),
            allow.ownerDefinedIn("ownerCognitoId").to(["read", "update"])
          ]),
        description: a.string()
          .authorization((allow) => [
            allow.guest().to(["read"]),
            allow.ownerDefinedIn("ownerCognitoId").to(["read", "update"])
          ]),
        publicity: a.string()
          .authorization((allow) => [
            allow.guest().to(["read"]),
            allow.ownerDefinedIn("ownerCognitoId").to(["read", "update"])
          ]),
      })
      .identifier(["ownerUsername", "canvasId"])
      .secondaryIndexes((index) => [index("canvasId")])
      .authorization(allow => [
        allow.guest().to(["read"]),
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
      .handler(a.handler.function(createCanvasForUser))
  })
  .authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(createCanvasForUser)
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});