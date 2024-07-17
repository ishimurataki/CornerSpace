/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCanvases = /* GraphQL */ `query GetCanvases($canvasId: String!, $ownerUsername: ID!) {
  getCanvases(canvasId: $canvasId, ownerUsername: $ownerUsername) {
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
    owner
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
      owner
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
      owner
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
