/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCanvasForUser = /* GraphQL */ `mutation CreateCanvasForUser(
  $canvasData: String!
  $canvasId: String
  $canvasThumbail: String!
  $description: String!
  $name: String!
  $ownerUsername: String!
  $publicity: String!
) {
  createCanvasForUser(
    canvasData: $canvasData
    canvasId: $canvasId
    canvasThumbail: $canvasThumbail
    description: $description
    name: $name
    ownerUsername: $ownerUsername
    publicity: $publicity
  ) {
    canvasId
    errorMessage
    isCanvasSaved
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCanvasForUserMutationVariables,
  APITypes.CreateCanvasForUserMutation
>;
export const createCanvasSocialStats = /* GraphQL */ `mutation CreateCanvasSocialStats(
  $condition: ModelCanvasSocialStatsConditionInput
  $input: CreateCanvasSocialStatsInput!
) {
  createCanvasSocialStats(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCanvasSocialStatsMutationVariables,
  APITypes.CreateCanvasSocialStatsMutation
>;
export const createCanvases = /* GraphQL */ `mutation CreateCanvases(
  $condition: ModelCanvasesConditionInput
  $input: CreateCanvasesInput!
) {
  createCanvases(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCanvasesMutationVariables,
  APITypes.CreateCanvasesMutation
>;
export const createUsers = /* GraphQL */ `mutation CreateUsers(
  $condition: ModelUsersConditionInput
  $input: CreateUsersInput!
) {
  createUsers(condition: $condition, input: $input) {
    cognitoId
    createdAt
    numberOfCanvases
    updatedAt
    username
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUsersMutationVariables,
  APITypes.CreateUsersMutation
>;
export const deleteCanvasForUser = /* GraphQL */ `mutation DeleteCanvasForUser($canvasId: String!) {
  deleteCanvasForUser(canvasId: $canvasId) {
    errorMessage
    isCanvasDeleted
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCanvasForUserMutationVariables,
  APITypes.DeleteCanvasForUserMutation
>;
export const deleteCanvasSocialStats = /* GraphQL */ `mutation DeleteCanvasSocialStats(
  $condition: ModelCanvasSocialStatsConditionInput
  $input: DeleteCanvasSocialStatsInput!
) {
  deleteCanvasSocialStats(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCanvasSocialStatsMutationVariables,
  APITypes.DeleteCanvasSocialStatsMutation
>;
export const deleteCanvases = /* GraphQL */ `mutation DeleteCanvases(
  $condition: ModelCanvasesConditionInput
  $input: DeleteCanvasesInput!
) {
  deleteCanvases(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCanvasesMutationVariables,
  APITypes.DeleteCanvasesMutation
>;
export const deleteUsers = /* GraphQL */ `mutation DeleteUsers(
  $condition: ModelUsersConditionInput
  $input: DeleteUsersInput!
) {
  deleteUsers(condition: $condition, input: $input) {
    cognitoId
    createdAt
    numberOfCanvases
    updatedAt
    username
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUsersMutationVariables,
  APITypes.DeleteUsersMutation
>;
export const updateCanvasSocialStats = /* GraphQL */ `mutation UpdateCanvasSocialStats(
  $condition: ModelCanvasSocialStatsConditionInput
  $input: UpdateCanvasSocialStatsInput!
) {
  updateCanvasSocialStats(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCanvasSocialStatsMutationVariables,
  APITypes.UpdateCanvasSocialStatsMutation
>;
export const updateCanvases = /* GraphQL */ `mutation UpdateCanvases(
  $condition: ModelCanvasesConditionInput
  $input: UpdateCanvasesInput!
) {
  updateCanvases(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCanvasesMutationVariables,
  APITypes.UpdateCanvasesMutation
>;
export const updateUsers = /* GraphQL */ `mutation UpdateUsers(
  $condition: ModelUsersConditionInput
  $input: UpdateUsersInput!
) {
  updateUsers(condition: $condition, input: $input) {
    cognitoId
    createdAt
    numberOfCanvases
    updatedAt
    username
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUsersMutationVariables,
  APITypes.UpdateUsersMutation
>;
