import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';

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
        ownerUsername: a.id().required(),
        canvasId: a.string().required(),
        name: a.string().required(),
        description: a.string(),
        publicity: a.enum(["PRIVATE", "PUBLIC"])
      })
      .identifier(["ownerUsername", "canvasId"])
      .secondaryIndexes((index) => [index("canvasId")])
      .authorization(allow => [
        allow.guest().to(["read"]),
        allow.owner().to(["create", "read", "update", "delete"])
      ]),
    getCanvasesForUser: a
      .query()
      .arguments({ user: a.string().required() })
      .returns(a.ref("Canvases").array())
      .authorization(allow => [allow.publicApiKey()])
      .handler(a.handler.custom({
        dataSource: a.ref("Canvases"),
        entry: "./get-canvases-for-user.js"
      }))
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});