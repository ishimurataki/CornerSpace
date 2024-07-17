/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCanvases = /* GraphQL */ `subscription OnCreateCanvases(
  $filter: ModelSubscriptionCanvasesFilterInput
  $owner: String
) {
  onCreateCanvases(filter: $filter, owner: $owner) {
    canvasId
    createdAt
    description
    name
    owner
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
export const onDeleteCanvases = /* GraphQL */ `subscription OnDeleteCanvases(
  $filter: ModelSubscriptionCanvasesFilterInput
  $owner: String
) {
  onDeleteCanvases(filter: $filter, owner: $owner) {
    canvasId
    createdAt
    description
    name
    owner
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
export const onUpdateCanvases = /* GraphQL */ `subscription OnUpdateCanvases(
  $filter: ModelSubscriptionCanvasesFilterInput
  $owner: String
) {
  onUpdateCanvases(filter: $filter, owner: $owner) {
    canvasId
    createdAt
    description
    name
    owner
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
