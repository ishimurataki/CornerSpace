import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Users: a.model({
    username: a.id().required(),
    numberOfCanvases: a.integer().default(3)
  }).identifier(["username"])
    .authorization([a.allow.owner()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  },
});