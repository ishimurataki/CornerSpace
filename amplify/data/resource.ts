import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { createCanvasForUser } from '../functions/create-canvas-for-user/resource';
import { deleteCanvasForUser } from '../functions/delete-canvas-for-user/resource';
import { getPublicCanvasIdsForUser } from '../functions/get-public-canvas-ids-for-user/resource';
import { getAllCanvasIdsForAuthenticatedUser } from '../functions/get-all-canvas-ids-for-authenticated-user/resource';
import { getCanvasCard } from '../functions/get-canvas-card/resource';
import { getCanvasData } from '../functions/get-canvas-data/resource';
import { likeCanvasForUser } from '../functions/like-canvas-for-user/resource';
import { followUser } from '../functions/follow-user/resource';
import { resendConfirmationCode } from '../functions/resend-confirmation-code/resource';
import { changeBioForUser } from '../functions/change-bio-for-user/resource';
import { getUserEmail } from '../functions/get-user-email/resource';

const schema = a
  .schema({
    Users: a
      .model({
        username: a.id().required()
          .authorization((allow) => [
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        cognitoId: a.string()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        numberOfCanvases: a.integer().default(3)
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        biography: a.string()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read", "delete"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"])
          ]),
        email: a.email()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        emailVisible: a.boolean().required()
          .default(false)
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read", "update"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"])
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
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        description: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        publicity: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
      })
      .identifier(["ownerUsername", "canvasId"])
      .secondaryIndexes((index) => [index("canvasId")])
      .authorization(allow => [
        allow.ownerDefinedIn("ownerCognitoId").to(["read"])
      ]),
    CanvasSocialStats: a
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
        likeCount: a.integer().required()
          .default(0)
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ]),
        viewCount: a.integer().required()
          .default(0)
          .authorization((allow) => [
            allow.ownerDefinedIn("ownerCognitoId").to(["read"])
          ])
      })
      .identifier(["ownerUsername", "canvasId"])
      .secondaryIndexes((index) => [index("canvasId")])
      .authorization(allow => [
        allow.ownerDefinedIn("ownerCognitoId").to(["read"])
      ]),
    CanvasLikes: a
      .model({
        username: a.id().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        cognitoId: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        likeId: a.integer().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        canvasId: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
      })
      .identifier(["username", "likeId"])
      .secondaryIndexes((index) => [index("canvasId").sortKeys(["username"])])
      .authorization(allow => [
        allow.ownerDefinedIn("ownerCognitoId").to(["read"])
      ]),
    UserFollowing: a
      .model({
        username: a.id().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        cognitoId: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        following: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        followDate: a.datetime().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
      })
      .identifier(["username", "following"])
      .authorization(allow => [
        allow.ownerDefinedIn("ownerCognitoId").to(["read"])
      ]),
    UserFollowers: a
      .model({
        username: a.id().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        cognitoId: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        follower: a.string().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
        followDate: a.datetime().required()
          .authorization((allow) => [
            allow.ownerDefinedIn("cognitoId").to(["read"])
          ]),
      })
      .identifier(["username", "follower"])
      .authorization(allow => [
        allow.ownerDefinedIn("ownerCognitoId").to(["read"])
      ]),
    CanvasesDigest: a
      .model({
        partitionKey: a.string().required(),
        sortKey: a.float().required(),
        canvasId: a.string(),
        count: a.integer()
      })
      .identifier(["partitionKey", "sortKey"])
      .secondaryIndexes((index) => [index("canvasId").sortKeys(["partitionKey"])])
      .authorization(allow => [
        allow.guest().to(["read"]),
        allow.authenticated().to(["read"])
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
      nextToken: a.string(),
      errorMessage: a.string()
    }),
    getPublicCanvasIdsForUser: a
      .query()
      .arguments({ ownerUsername: a.string().required(), nextToken: a.string() })
      .authorization((allow) => [allow.authenticated(), allow.guest()])
      .returns(a.ref('getCanvasIdsForUserResponse'))
      .handler(a.handler.function(getPublicCanvasIdsForUser)),
    getAllCanvasIdsForAuthenticatedUser: a
      .query()
      .arguments({ ownerUsername: a.string().required(), nextToken: a.string() })
      .authorization((allow) => [allow.authenticated()])
      .returns(a.ref('getCanvasIdsForUserResponse'))
      .handler(a.handler.function(getAllCanvasIdsForAuthenticatedUser)),
    canvasCard: a.customType({
      ownerUsername: a.string().required(),
      name: a.string().required(),
      description: a.string().required(),
      publicity: a.string().required(),
      thumbnail: a.string().required(),
      likeCount: a.integer().required(),
      viewCount: a.integer().required()
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
      likeCount: a.integer().required(),
      viewCount: a.integer().required(),
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
      .handler(a.handler.function(getCanvasData)),
    likeCanvasForUserResponse: a.customType({
      isCanvasLiked: a.boolean().required(),
      errorMessage: a.string()
    }),
    likeCanvasForUser: a
      .mutation()
      .arguments({
        username: a.string().required(),
        canvasId: a.string().required(),
        removeLike: a.boolean().required()
      })
      .authorization((allow) => [allow.authenticated()])
      .returns(a.ref('likeCanvasForUserResponse'))
      .handler(a.handler.function(likeCanvasForUser)),
    followUserResponse: a.customType({
      isUserFollowed: a.boolean().required(),
      errorMessage: a.string()
    }),
    followUser: a
      .mutation()
      .arguments({
        username: a.string().required(),
        userToFollow: a.string().required(),
        unfollow: a.boolean().required()
      })
      .authorization((allow) => [allow.authenticated()])
      .returns(a.ref('followUserResponse'))
      .handler(a.handler.function(followUser)),
    resendConfirmationCodeResponse: a.customType({
      isConfirmationCodeResent: a.boolean().required(),
      userId: a.string(),
      errorMessage: a.string()
    }),
    resendConfirmationCode: a
      .query()
      .arguments({
        cognitoClientId: a.string().required(),
        email: a.string().required()
      })
      .authorization((allow) => [allow.guest()])
      .returns(a.ref('resendConfirmationCodeResponse'))
      .handler(a.handler.function(resendConfirmationCode)),
    changeBioForUserResponse: a.customType({
      isBioChanged: a.boolean().required(),
      errorMessage: a.string()
    }),
    changeBioForUser: a
      .mutation()
      .arguments({
        username: a.string().required(),
        newBio: a.string()
      })
      .authorization((allow) => [allow.authenticated()])
      .returns(a.ref('changeBioForUserResponse'))
      .handler(a.handler.function(changeBioForUser)),
    getUserEmailResponse: a.customType({
      isEmailReturned: a.boolean().required(),
      email: a.string(),
      errorMessage: a.string()
    }),
    getUserEmail: a
      .query()
      .arguments({
        username: a.string().required()
      })
      .authorization((allow) => [allow.guest()])
      .returns(a.ref('getUserEmailResponse'))
      .handler(a.handler.function(getUserEmail)),
  })
  .authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(createCanvasForUser),
    allow.resource(deleteCanvasForUser),
    allow.resource(getPublicCanvasIdsForUser),
    allow.resource(getAllCanvasIdsForAuthenticatedUser),
    allow.resource(getCanvasCard),
    allow.resource(getCanvasData),
    allow.resource(likeCanvasForUser),
    allow.resource(followUser),
    allow.resource(changeBioForUser),
    allow.resource(getUserEmail)
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});