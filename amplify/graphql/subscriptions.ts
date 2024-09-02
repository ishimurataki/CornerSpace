/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCanvasLikes = /* GraphQL */ `subscription OnCreateCanvasLikes(
  $cognitoId: String
  $filter: ModelSubscriptionCanvasLikesFilterInput
) {
  onCreateCanvasLikes(cognitoId: $cognitoId, filter: $filter) {
    canvasId
    cognitoId
    createdAt
    likeId
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCanvasLikesSubscriptionVariables,
  APITypes.OnCreateCanvasLikesSubscription
>;
export const onCreateCanvasSocialStats = /* GraphQL */ `subscription OnCreateCanvasSocialStats(
  $filter: ModelSubscriptionCanvasSocialStatsFilterInput
  $ownerCognitoId: String
) {
  onCreateCanvasSocialStats(filter: $filter, ownerCognitoId: $ownerCognitoId) {
    canvasId
    createdAt
    likeCount
    ownerCognitoId
    ownerUsername
    updatedAt
    viewCount
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCanvasSocialStatsSubscriptionVariables,
  APITypes.OnCreateCanvasSocialStatsSubscription
>;
export const onCreateCanvases = /* GraphQL */ `subscription OnCreateCanvases(
  $filter: ModelSubscriptionCanvasesFilterInput
  $ownerCognitoId: String
) {
  onCreateCanvases(filter: $filter, ownerCognitoId: $ownerCognitoId) {
    canvasId
    createdAt
    description
    name
    ownerCognitoId
    ownerUsername
    publicity
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCanvasesSubscriptionVariables,
  APITypes.OnCreateCanvasesSubscription
>;
export const onCreateCanvasesDigest = /* GraphQL */ `subscription OnCreateCanvasesDigest(
  $filter: ModelSubscriptionCanvasesDigestFilterInput
) {
  onCreateCanvasesDigest(filter: $filter) {
    canvasId
    count
    createdAt
    partitionKey
    sortKey
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCanvasesDigestSubscriptionVariables,
  APITypes.OnCreateCanvasesDigestSubscription
>;
export const onCreateUserFollowers = /* GraphQL */ `subscription OnCreateUserFollowers(
  $cognitoId: String
  $filter: ModelSubscriptionUserFollowersFilterInput
) {
  onCreateUserFollowers(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
    followDate
    follower
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserFollowersSubscriptionVariables,
  APITypes.OnCreateUserFollowersSubscription
>;
export const onCreateUserFollowing = /* GraphQL */ `subscription OnCreateUserFollowing(
  $cognitoId: String
  $filter: ModelSubscriptionUserFollowingFilterInput
) {
  onCreateUserFollowing(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
    followDate
    following
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserFollowingSubscriptionVariables,
  APITypes.OnCreateUserFollowingSubscription
>;
export const onCreateUsers = /* GraphQL */ `subscription OnCreateUsers(
  $cognitoId: String
  $filter: ModelSubscriptionUsersFilterInput
) {
  onCreateUsers(cognitoId: $cognitoId, filter: $filter) {
    biography
    cognitoId
    createdAt
    emailVisible
    numberOfCanvases
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUsersSubscriptionVariables,
  APITypes.OnCreateUsersSubscription
>;
export const onDeleteCanvasLikes = /* GraphQL */ `subscription OnDeleteCanvasLikes(
  $cognitoId: String
  $filter: ModelSubscriptionCanvasLikesFilterInput
) {
  onDeleteCanvasLikes(cognitoId: $cognitoId, filter: $filter) {
    canvasId
    cognitoId
    createdAt
    likeId
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCanvasLikesSubscriptionVariables,
  APITypes.OnDeleteCanvasLikesSubscription
>;
export const onDeleteCanvasSocialStats = /* GraphQL */ `subscription OnDeleteCanvasSocialStats(
  $filter: ModelSubscriptionCanvasSocialStatsFilterInput
  $ownerCognitoId: String
) {
  onDeleteCanvasSocialStats(filter: $filter, ownerCognitoId: $ownerCognitoId) {
    canvasId
    createdAt
    likeCount
    ownerCognitoId
    ownerUsername
    updatedAt
    viewCount
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCanvasSocialStatsSubscriptionVariables,
  APITypes.OnDeleteCanvasSocialStatsSubscription
>;
export const onDeleteCanvases = /* GraphQL */ `subscription OnDeleteCanvases(
  $filter: ModelSubscriptionCanvasesFilterInput
  $ownerCognitoId: String
) {
  onDeleteCanvases(filter: $filter, ownerCognitoId: $ownerCognitoId) {
    canvasId
    createdAt
    description
    name
    ownerCognitoId
    ownerUsername
    publicity
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCanvasesSubscriptionVariables,
  APITypes.OnDeleteCanvasesSubscription
>;
export const onDeleteCanvasesDigest = /* GraphQL */ `subscription OnDeleteCanvasesDigest(
  $filter: ModelSubscriptionCanvasesDigestFilterInput
) {
  onDeleteCanvasesDigest(filter: $filter) {
    canvasId
    count
    createdAt
    partitionKey
    sortKey
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCanvasesDigestSubscriptionVariables,
  APITypes.OnDeleteCanvasesDigestSubscription
>;
export const onDeleteUserFollowers = /* GraphQL */ `subscription OnDeleteUserFollowers(
  $cognitoId: String
  $filter: ModelSubscriptionUserFollowersFilterInput
) {
  onDeleteUserFollowers(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
    followDate
    follower
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserFollowersSubscriptionVariables,
  APITypes.OnDeleteUserFollowersSubscription
>;
export const onDeleteUserFollowing = /* GraphQL */ `subscription OnDeleteUserFollowing(
  $cognitoId: String
  $filter: ModelSubscriptionUserFollowingFilterInput
) {
  onDeleteUserFollowing(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
    followDate
    following
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserFollowingSubscriptionVariables,
  APITypes.OnDeleteUserFollowingSubscription
>;
export const onDeleteUsers = /* GraphQL */ `subscription OnDeleteUsers(
  $cognitoId: String
  $filter: ModelSubscriptionUsersFilterInput
) {
  onDeleteUsers(cognitoId: $cognitoId, filter: $filter) {
    biography
    cognitoId
    createdAt
    emailVisible
    numberOfCanvases
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUsersSubscriptionVariables,
  APITypes.OnDeleteUsersSubscription
>;
export const onUpdateCanvasLikes = /* GraphQL */ `subscription OnUpdateCanvasLikes(
  $cognitoId: String
  $filter: ModelSubscriptionCanvasLikesFilterInput
) {
  onUpdateCanvasLikes(cognitoId: $cognitoId, filter: $filter) {
    canvasId
    cognitoId
    createdAt
    likeId
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCanvasLikesSubscriptionVariables,
  APITypes.OnUpdateCanvasLikesSubscription
>;
export const onUpdateCanvasSocialStats = /* GraphQL */ `subscription OnUpdateCanvasSocialStats(
  $filter: ModelSubscriptionCanvasSocialStatsFilterInput
  $ownerCognitoId: String
) {
  onUpdateCanvasSocialStats(filter: $filter, ownerCognitoId: $ownerCognitoId) {
    canvasId
    createdAt
    likeCount
    ownerCognitoId
    ownerUsername
    updatedAt
    viewCount
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCanvasSocialStatsSubscriptionVariables,
  APITypes.OnUpdateCanvasSocialStatsSubscription
>;
export const onUpdateCanvases = /* GraphQL */ `subscription OnUpdateCanvases(
  $filter: ModelSubscriptionCanvasesFilterInput
  $ownerCognitoId: String
) {
  onUpdateCanvases(filter: $filter, ownerCognitoId: $ownerCognitoId) {
    canvasId
    createdAt
    description
    name
    ownerCognitoId
    ownerUsername
    publicity
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCanvasesSubscriptionVariables,
  APITypes.OnUpdateCanvasesSubscription
>;
export const onUpdateCanvasesDigest = /* GraphQL */ `subscription OnUpdateCanvasesDigest(
  $filter: ModelSubscriptionCanvasesDigestFilterInput
) {
  onUpdateCanvasesDigest(filter: $filter) {
    canvasId
    count
    createdAt
    partitionKey
    sortKey
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCanvasesDigestSubscriptionVariables,
  APITypes.OnUpdateCanvasesDigestSubscription
>;
export const onUpdateUserFollowers = /* GraphQL */ `subscription OnUpdateUserFollowers(
  $cognitoId: String
  $filter: ModelSubscriptionUserFollowersFilterInput
) {
  onUpdateUserFollowers(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
    followDate
    follower
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserFollowersSubscriptionVariables,
  APITypes.OnUpdateUserFollowersSubscription
>;
export const onUpdateUserFollowing = /* GraphQL */ `subscription OnUpdateUserFollowing(
  $cognitoId: String
  $filter: ModelSubscriptionUserFollowingFilterInput
) {
  onUpdateUserFollowing(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
    followDate
    following
    ownerCognitoId
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserFollowingSubscriptionVariables,
  APITypes.OnUpdateUserFollowingSubscription
>;
export const onUpdateUsers = /* GraphQL */ `subscription OnUpdateUsers(
  $cognitoId: String
  $filter: ModelSubscriptionUsersFilterInput
) {
  onUpdateUsers(cognitoId: $cognitoId, filter: $filter) {
    biography
    cognitoId
    createdAt
    emailVisible
    numberOfCanvases
    updatedAt
    username
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUsersSubscriptionVariables,
  APITypes.OnUpdateUsersSubscription
>;
