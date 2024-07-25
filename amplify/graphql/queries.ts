/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCanvasCard = /* GraphQL */ `query GetCanvasCard($canvasId: String!, $ownerUsername: String!) {
  getCanvasCard(canvasId: $canvasId, ownerUsername: $ownerUsername) {
    canvasCard {
      description
      name
      ownerUsername
      publicity
      thumbnail
      __typename
    }
    errorMessage
    isCanvasCardReturned
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCanvasCardQueryVariables,
  APITypes.GetCanvasCardQuery
>;
export const getCanvasData = /* GraphQL */ `query GetCanvasData($canvasId: String!, $ownerUsername: String!) {
  getCanvasData(canvasId: $canvasId, ownerUsername: $ownerUsername) {
    canvasData {
      canvasData
      description
      name
      ownerUsername
      publicity
      __typename
    }
    errorMessage
    isCanvasDataReturned
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCanvasDataQueryVariables,
  APITypes.GetCanvasDataQuery
>;
export const getCanvases = /* GraphQL */ `query GetCanvases($canvasId: String!, $ownerUsername: ID!) {
  getCanvases(canvasId: $canvasId, ownerUsername: $ownerUsername) {
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
` as GeneratedQuery<
  APITypes.GetCanvasesQueryVariables,
  APITypes.GetCanvasesQuery
>;
export const getCanvasesForUser = /* GraphQL */ `query GetCanvasesForUser($user: String!) {
  getCanvasesForUser(user: $user) {
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
` as GeneratedQuery<
  APITypes.GetCanvasesForUserQueryVariables,
  APITypes.GetCanvasesForUserQuery
>;
export const getPublicCanvasIdsForUser = /* GraphQL */ `query GetPublicCanvasIdsForUser($ownerUsername: String!) {
  getPublicCanvasIdsForUser(ownerUsername: $ownerUsername) {
    areCanvasIdsReturned
    canvasIds
    errorMessage
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPublicCanvasIdsForUserQueryVariables,
  APITypes.GetPublicCanvasIdsForUserQuery
>;
export const getUsers = /* GraphQL */ `query GetUsers($username: ID!) {
  getUsers(username: $username) {
    cognitoId
    createdAt
    numberOfCanvases
    updatedAt
    username
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUsersQueryVariables, APITypes.GetUsersQuery>;
export const listCanvases = /* GraphQL */ `query ListCanvases(
  $canvasId: ModelStringKeyConditionInput
  $filter: ModelCanvasesFilterInput
  $limit: Int
  $nextToken: String
  $ownerUsername: ID
  $sortDirection: ModelSortDirection
) {
  listCanvases(
    canvasId: $canvasId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    ownerUsername: $ownerUsername
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCanvasesQueryVariables,
  APITypes.ListCanvasesQuery
>;
export const listCanvasesByCanvasId = /* GraphQL */ `query ListCanvasesByCanvasId(
  $canvasId: String!
  $filter: ModelCanvasesFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listCanvasesByCanvasId(
    canvasId: $canvasId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCanvasesByCanvasIdQueryVariables,
  APITypes.ListCanvasesByCanvasIdQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUsersFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $username: ID
) {
  listUsers(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    username: $username
  ) {
    items {
      cognitoId
      createdAt
      numberOfCanvases
      updatedAt
      username
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
