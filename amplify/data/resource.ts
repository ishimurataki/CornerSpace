import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Users: a
    .model({
      username: a.id().required(),
      numberOfCanvases: a.integer().default(3)
    })
    .authorization(allow => [allow.publicApiKey()])
    .identifier(["username"]),
  Canvases: a
    .model({
      owner: a.id().required(),
      canvasId: a.string().required(),
      name: a.string().required(),
      description: a.string(),
      publicity: a.enum(["PRIVATE", "PUBLIC"])
    })
    .identifier(["owner", "canvasId"])
    .authorization(allow => [allow.publicApiKey()]),
  getCanvasesForUser: a
    .query()
    .arguments({ user: a.string().required() })
    .returns(a.ref("Canvases").array())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.custom({
      dataSource: a.ref("Canvases"),
      entry: "./get-canvases-for-user.js"
    }))
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});