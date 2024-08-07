/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

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
export const onCreateUsers = /* GraphQL */ `subscription OnCreateUsers(
  $cognitoId: String
  $filter: ModelSubscriptionUsersFilterInput
) {
  onCreateUsers(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
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
export const onDeleteUsers = /* GraphQL */ `subscription OnDeleteUsers(
  $cognitoId: String
  $filter: ModelSubscriptionUsersFilterInput
) {
  onDeleteUsers(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
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
export const onUpdateUsers = /* GraphQL */ `subscription OnUpdateUsers(
  $cognitoId: String
  $filter: ModelSubscriptionUsersFilterInput
) {
  onUpdateUsers(cognitoId: $cognitoId, filter: $filter) {
    cognitoId
    createdAt
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
