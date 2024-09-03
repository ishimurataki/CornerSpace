/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const changeBioForUser = /* GraphQL */ `mutation ChangeBioForUser($newBio: String, $username: String!) {
  changeBioForUser(newBio: $newBio, username: $username) {
    errorMessage
    isBioChanged
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ChangeBioForUserMutationVariables,
  APITypes.ChangeBioForUserMutation
>;
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
export const createCanvasLikes = /* GraphQL */ `mutation CreateCanvasLikes(
  $condition: ModelCanvasLikesConditionInput
  $input: CreateCanvasLikesInput!
) {
  createCanvasLikes(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCanvasLikesMutationVariables,
  APITypes.CreateCanvasLikesMutation
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
export const createCanvasesDigest = /* GraphQL */ `mutation CreateCanvasesDigest(
  $condition: ModelCanvasesDigestConditionInput
  $input: CreateCanvasesDigestInput!
) {
  createCanvasesDigest(condition: $condition, input: $input) {
    canvasId
    count
    createdAt
    partitionKey
    sortKey
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCanvasesDigestMutationVariables,
  APITypes.CreateCanvasesDigestMutation
>;
export const createUserFollowers = /* GraphQL */ `mutation CreateUserFollowers(
  $condition: ModelUserFollowersConditionInput
  $input: CreateUserFollowersInput!
) {
  createUserFollowers(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserFollowersMutationVariables,
  APITypes.CreateUserFollowersMutation
>;
export const createUserFollowing = /* GraphQL */ `mutation CreateUserFollowing(
  $condition: ModelUserFollowingConditionInput
  $input: CreateUserFollowingInput!
) {
  createUserFollowing(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserFollowingMutationVariables,
  APITypes.CreateUserFollowingMutation
>;
export const createUsers = /* GraphQL */ `mutation CreateUsers(
  $condition: ModelUsersConditionInput
  $input: CreateUsersInput!
) {
  createUsers(condition: $condition, input: $input) {
    biography
    cognitoId
    createdAt
    email
    emailVisible
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
export const deleteCanvasLikes = /* GraphQL */ `mutation DeleteCanvasLikes(
  $condition: ModelCanvasLikesConditionInput
  $input: DeleteCanvasLikesInput!
) {
  deleteCanvasLikes(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCanvasLikesMutationVariables,
  APITypes.DeleteCanvasLikesMutation
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
export const deleteCanvasesDigest = /* GraphQL */ `mutation DeleteCanvasesDigest(
  $condition: ModelCanvasesDigestConditionInput
  $input: DeleteCanvasesDigestInput!
) {
  deleteCanvasesDigest(condition: $condition, input: $input) {
    canvasId
    count
    createdAt
    partitionKey
    sortKey
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCanvasesDigestMutationVariables,
  APITypes.DeleteCanvasesDigestMutation
>;
export const deleteUserFollowers = /* GraphQL */ `mutation DeleteUserFollowers(
  $condition: ModelUserFollowersConditionInput
  $input: DeleteUserFollowersInput!
) {
  deleteUserFollowers(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserFollowersMutationVariables,
  APITypes.DeleteUserFollowersMutation
>;
export const deleteUserFollowing = /* GraphQL */ `mutation DeleteUserFollowing(
  $condition: ModelUserFollowingConditionInput
  $input: DeleteUserFollowingInput!
) {
  deleteUserFollowing(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserFollowingMutationVariables,
  APITypes.DeleteUserFollowingMutation
>;
export const deleteUsers = /* GraphQL */ `mutation DeleteUsers(
  $condition: ModelUsersConditionInput
  $input: DeleteUsersInput!
) {
  deleteUsers(condition: $condition, input: $input) {
    biography
    cognitoId
    createdAt
    email
    emailVisible
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
export const followUser = /* GraphQL */ `mutation FollowUser(
  $unfollow: Boolean!
  $userToFollow: String!
  $username: String!
) {
  followUser(
    unfollow: $unfollow
    userToFollow: $userToFollow
    username: $username
  ) {
    errorMessage
    isUserFollowed
    __typename
  }
}
` as GeneratedMutation<
  APITypes.FollowUserMutationVariables,
  APITypes.FollowUserMutation
>;
export const likeCanvasForUser = /* GraphQL */ `mutation LikeCanvasForUser(
  $canvasId: String!
  $removeLike: Boolean!
  $username: String!
) {
  likeCanvasForUser(
    canvasId: $canvasId
    removeLike: $removeLike
    username: $username
  ) {
    errorMessage
    isCanvasLiked
    __typename
  }
}
` as GeneratedMutation<
  APITypes.LikeCanvasForUserMutationVariables,
  APITypes.LikeCanvasForUserMutation
>;
export const updateCanvasLikes = /* GraphQL */ `mutation UpdateCanvasLikes(
  $condition: ModelCanvasLikesConditionInput
  $input: UpdateCanvasLikesInput!
) {
  updateCanvasLikes(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCanvasLikesMutationVariables,
  APITypes.UpdateCanvasLikesMutation
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
export const updateCanvasesDigest = /* GraphQL */ `mutation UpdateCanvasesDigest(
  $condition: ModelCanvasesDigestConditionInput
  $input: UpdateCanvasesDigestInput!
) {
  updateCanvasesDigest(condition: $condition, input: $input) {
    canvasId
    count
    createdAt
    partitionKey
    sortKey
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCanvasesDigestMutationVariables,
  APITypes.UpdateCanvasesDigestMutation
>;
export const updateUserFollowers = /* GraphQL */ `mutation UpdateUserFollowers(
  $condition: ModelUserFollowersConditionInput
  $input: UpdateUserFollowersInput!
) {
  updateUserFollowers(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserFollowersMutationVariables,
  APITypes.UpdateUserFollowersMutation
>;
export const updateUserFollowing = /* GraphQL */ `mutation UpdateUserFollowing(
  $condition: ModelUserFollowingConditionInput
  $input: UpdateUserFollowingInput!
) {
  updateUserFollowing(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserFollowingMutationVariables,
  APITypes.UpdateUserFollowingMutation
>;
export const updateUsers = /* GraphQL */ `mutation UpdateUsers(
  $condition: ModelUsersConditionInput
  $input: UpdateUsersInput!
) {
  updateUsers(condition: $condition, input: $input) {
    biography
    cognitoId
    createdAt
    email
    emailVisible
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
