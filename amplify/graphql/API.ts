/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type getCanvasIdsForUserResponse = {
  __typename: "getCanvasIdsForUserResponse",
  areCanvasIdsReturned: boolean,
  canvasIds?: Array< string > | null,
  errorMessage?: string | null,
  nextToken?: string | null,
};

export type getCanvasCardResponse = {
  __typename: "getCanvasCardResponse",
  canvasCard?: canvasCard | null,
  errorMessage?: string | null,
  isCanvasCardReturned: boolean,
};

export type canvasCard = {
  __typename: "canvasCard",
  description: string,
  likeCount: number,
  name: string,
  ownerUsername: string,
  publicity: string,
  thumbnail: string,
  viewCount: number,
};

export type getCanvasDataResponse = {
  __typename: "getCanvasDataResponse",
  canvasData?: canvasData | null,
  errorMessage?: string | null,
  isCanvasDataReturned: boolean,
};

export type canvasData = {
  __typename: "canvasData",
  canvasData: string,
  description: string,
  likeCount: number,
  name: string,
  ownerUsername: string,
  publicity: string,
  viewCount: number,
};

export type CanvasLikes = {
  __typename: "CanvasLikes",
  canvasId: string,
  cognitoId: string,
  createdAt: string,
  likeId: number,
  ownerCognitoId?: string | null,
  updatedAt: string,
  username: string,
};

export type CanvasSocialStats = {
  __typename: "CanvasSocialStats",
  canvasId: string,
  createdAt: string,
  likeCount: number,
  ownerCognitoId?: string | null,
  ownerUsername: string,
  updatedAt: string,
  viewCount: number,
};

export type Canvases = {
  __typename: "Canvases",
  canvasId: string,
  createdAt: string,
  description: string,
  name: string,
  ownerCognitoId?: string | null,
  ownerUsername: string,
  publicity: string,
  updatedAt: string,
};

export type CanvasesDigest = {
  __typename: "CanvasesDigest",
  canvasId?: string | null,
  count?: number | null,
  createdAt: string,
  partitionKey: string,
  sortKey: number,
  updatedAt: string,
};

export type UserFollowers = {
  __typename: "UserFollowers",
  cognitoId: string,
  createdAt: string,
  followDate: string,
  follower: string,
  ownerCognitoId?: string | null,
  updatedAt: string,
  username: string,
};

export type UserFollowing = {
  __typename: "UserFollowing",
  cognitoId: string,
  createdAt: string,
  followDate: string,
  following: string,
  ownerCognitoId?: string | null,
  updatedAt: string,
  username: string,
};

export type Users = {
  __typename: "Users",
  biography?: string | null,
  cognitoId?: string | null,
  createdAt: string,
  email?: string | null,
  emailVisible: boolean,
  numberOfCanvases?: number | null,
  updatedAt: string,
  username: string,
};

export type ModelCanvasLikesFilterInput = {
  and?: Array< ModelCanvasLikesFilterInput | null > | null,
  canvasId?: ModelStringInput | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  likeId?: ModelIntInput | null,
  not?: ModelCanvasLikesFilterInput | null,
  or?: Array< ModelCanvasLikesFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelIDInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIntKeyConditionInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelCanvasLikesConnection = {
  __typename: "ModelCanvasLikesConnection",
  items:  Array<CanvasLikes | null >,
  nextToken?: string | null,
};

export type ModelIDKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export type ModelStringKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export type ModelCanvasSocialStatsFilterInput = {
  and?: Array< ModelCanvasSocialStatsFilterInput | null > | null,
  canvasId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  likeCount?: ModelIntInput | null,
  not?: ModelCanvasSocialStatsFilterInput | null,
  or?: Array< ModelCanvasSocialStatsFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  ownerUsername?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  viewCount?: ModelIntInput | null,
};

export type ModelCanvasSocialStatsConnection = {
  __typename: "ModelCanvasSocialStatsConnection",
  items:  Array<CanvasSocialStats | null >,
  nextToken?: string | null,
};

export type ModelCanvasesFilterInput = {
  and?: Array< ModelCanvasesFilterInput | null > | null,
  canvasId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelCanvasesFilterInput | null,
  or?: Array< ModelCanvasesFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  ownerUsername?: ModelIDInput | null,
  publicity?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCanvasesConnection = {
  __typename: "ModelCanvasesConnection",
  items:  Array<Canvases | null >,
  nextToken?: string | null,
};

export type ModelCanvasesDigestFilterInput = {
  and?: Array< ModelCanvasesDigestFilterInput | null > | null,
  canvasId?: ModelStringInput | null,
  count?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelCanvasesDigestFilterInput | null,
  or?: Array< ModelCanvasesDigestFilterInput | null > | null,
  partitionKey?: ModelStringInput | null,
  sortKey?: ModelFloatInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelCanvasesDigestConnection = {
  __typename: "ModelCanvasesDigestConnection",
  items:  Array<CanvasesDigest | null >,
  nextToken?: string | null,
};

export type ModelFloatKeyConditionInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
};

export type ModelUserFollowersFilterInput = {
  and?: Array< ModelUserFollowersFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  followDate?: ModelStringInput | null,
  follower?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelUserFollowersFilterInput | null,
  or?: Array< ModelUserFollowersFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelIDInput | null,
};

export type ModelUserFollowersConnection = {
  __typename: "ModelUserFollowersConnection",
  items:  Array<UserFollowers | null >,
  nextToken?: string | null,
};

export type ModelUserFollowingFilterInput = {
  and?: Array< ModelUserFollowingFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  followDate?: ModelStringInput | null,
  following?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelUserFollowingFilterInput | null,
  or?: Array< ModelUserFollowingFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelIDInput | null,
};

export type ModelUserFollowingConnection = {
  __typename: "ModelUserFollowingConnection",
  items:  Array<UserFollowing | null >,
  nextToken?: string | null,
};

export type ModelUsersFilterInput = {
  and?: Array< ModelUsersFilterInput | null > | null,
  biography?: ModelStringInput | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  emailVisible?: ModelBooleanInput | null,
  id?: ModelIDInput | null,
  not?: ModelUsersFilterInput | null,
  numberOfCanvases?: ModelIntInput | null,
  or?: Array< ModelUsersFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelIDInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelUsersConnection = {
  __typename: "ModelUsersConnection",
  items:  Array<Users | null >,
  nextToken?: string | null,
};

export type resendConfirmationCodeResponse = {
  __typename: "resendConfirmationCodeResponse",
  errorMessage?: string | null,
  isConfirmationCodeResent: boolean,
  userId?: string | null,
};

export type changeBioForUserResponse = {
  __typename: "changeBioForUserResponse",
  errorMessage?: string | null,
  isBioChanged: boolean,
};

export type createCanvasForUserResponse = {
  __typename: "createCanvasForUserResponse",
  canvasId?: string | null,
  errorMessage?: string | null,
  isCanvasSaved: boolean,
};

export type ModelCanvasLikesConditionInput = {
  and?: Array< ModelCanvasLikesConditionInput | null > | null,
  canvasId?: ModelStringInput | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelCanvasLikesConditionInput | null,
  or?: Array< ModelCanvasLikesConditionInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCanvasLikesInput = {
  canvasId: string,
  cognitoId: string,
  likeId: number,
  username: string,
};

export type ModelCanvasSocialStatsConditionInput = {
  and?: Array< ModelCanvasSocialStatsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  likeCount?: ModelIntInput | null,
  not?: ModelCanvasSocialStatsConditionInput | null,
  or?: Array< ModelCanvasSocialStatsConditionInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  viewCount?: ModelIntInput | null,
};

export type CreateCanvasSocialStatsInput = {
  canvasId: string,
  likeCount: number,
  ownerCognitoId?: string | null,
  ownerUsername: string,
  viewCount: number,
};

export type ModelCanvasesConditionInput = {
  and?: Array< ModelCanvasesConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelCanvasesConditionInput | null,
  or?: Array< ModelCanvasesConditionInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  publicity?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCanvasesInput = {
  canvasId: string,
  description: string,
  name: string,
  ownerCognitoId?: string | null,
  ownerUsername: string,
  publicity: string,
};

export type ModelCanvasesDigestConditionInput = {
  and?: Array< ModelCanvasesDigestConditionInput | null > | null,
  canvasId?: ModelStringInput | null,
  count?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelCanvasesDigestConditionInput | null,
  or?: Array< ModelCanvasesDigestConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCanvasesDigestInput = {
  canvasId?: string | null,
  count?: number | null,
  partitionKey: string,
  sortKey: number,
};

export type ModelUserFollowersConditionInput = {
  and?: Array< ModelUserFollowersConditionInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  followDate?: ModelStringInput | null,
  not?: ModelUserFollowersConditionInput | null,
  or?: Array< ModelUserFollowersConditionInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserFollowersInput = {
  cognitoId: string,
  followDate: string,
  follower: string,
  username: string,
};

export type ModelUserFollowingConditionInput = {
  and?: Array< ModelUserFollowingConditionInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  followDate?: ModelStringInput | null,
  not?: ModelUserFollowingConditionInput | null,
  or?: Array< ModelUserFollowingConditionInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserFollowingInput = {
  cognitoId: string,
  followDate: string,
  following: string,
  username: string,
};

export type ModelUsersConditionInput = {
  and?: Array< ModelUsersConditionInput | null > | null,
  biography?: ModelStringInput | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  emailVisible?: ModelBooleanInput | null,
  not?: ModelUsersConditionInput | null,
  numberOfCanvases?: ModelIntInput | null,
  or?: Array< ModelUsersConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUsersInput = {
  biography?: string | null,
  cognitoId?: string | null,
  email?: string | null,
  emailVisible: boolean,
  numberOfCanvases?: number | null,
  username: string,
};

export type deleteCanvasForUserResponse = {
  __typename: "deleteCanvasForUserResponse",
  errorMessage?: string | null,
  isCanvasDeleted: boolean,
};

export type DeleteCanvasLikesInput = {
  likeId: number,
  username: string,
};

export type DeleteCanvasSocialStatsInput = {
  canvasId: string,
  ownerUsername: string,
};

export type DeleteCanvasesInput = {
  canvasId: string,
  ownerUsername: string,
};

export type DeleteCanvasesDigestInput = {
  partitionKey: string,
  sortKey: number,
};

export type DeleteUserFollowersInput = {
  follower: string,
  username: string,
};

export type DeleteUserFollowingInput = {
  following: string,
  username: string,
};

export type DeleteUsersInput = {
  username: string,
};

export type followUserResponse = {
  __typename: "followUserResponse",
  errorMessage?: string | null,
  isUserFollowed: boolean,
};

export type likeCanvasForUserResponse = {
  __typename: "likeCanvasForUserResponse",
  errorMessage?: string | null,
  isCanvasLiked: boolean,
};

export type UpdateCanvasLikesInput = {
  canvasId?: string | null,
  cognitoId?: string | null,
  likeId: number,
  username: string,
};

export type UpdateCanvasSocialStatsInput = {
  canvasId: string,
  likeCount?: number | null,
  ownerCognitoId?: string | null,
  ownerUsername: string,
  viewCount?: number | null,
};

export type UpdateCanvasesInput = {
  canvasId: string,
  description?: string | null,
  name?: string | null,
  ownerCognitoId?: string | null,
  ownerUsername: string,
  publicity?: string | null,
};

export type UpdateCanvasesDigestInput = {
  canvasId?: string | null,
  count?: number | null,
  partitionKey: string,
  sortKey: number,
};

export type UpdateUserFollowersInput = {
  cognitoId?: string | null,
  followDate?: string | null,
  follower: string,
  username: string,
};

export type UpdateUserFollowingInput = {
  cognitoId?: string | null,
  followDate?: string | null,
  following: string,
  username: string,
};

export type UpdateUsersInput = {
  biography?: string | null,
  cognitoId?: string | null,
  email?: string | null,
  emailVisible?: boolean | null,
  numberOfCanvases?: number | null,
  username: string,
};

export type ModelSubscriptionCanvasLikesFilterInput = {
  and?: Array< ModelSubscriptionCanvasLikesFilterInput | null > | null,
  canvasId?: ModelSubscriptionStringInput | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  likeId?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionCanvasLikesFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionCanvasSocialStatsFilterInput = {
  and?: Array< ModelSubscriptionCanvasSocialStatsFilterInput | null > | null,
  canvasId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  likeCount?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionCanvasSocialStatsFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  ownerUsername?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  viewCount?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionCanvasesFilterInput = {
  and?: Array< ModelSubscriptionCanvasesFilterInput | null > | null,
  canvasId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCanvasesFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  ownerUsername?: ModelSubscriptionIDInput | null,
  publicity?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionCanvasesDigestFilterInput = {
  and?: Array< ModelSubscriptionCanvasesDigestFilterInput | null > | null,
  canvasId?: ModelSubscriptionStringInput | null,
  count?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionCanvasesDigestFilterInput | null > | null,
  partitionKey?: ModelSubscriptionStringInput | null,
  sortKey?: ModelSubscriptionFloatInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionUserFollowersFilterInput = {
  and?: Array< ModelSubscriptionUserFollowersFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  followDate?: ModelSubscriptionStringInput | null,
  follower?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionUserFollowersFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionUserFollowingFilterInput = {
  and?: Array< ModelSubscriptionUserFollowingFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  followDate?: ModelSubscriptionStringInput | null,
  following?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionUserFollowingFilterInput | null > | null,
  ownerCognitoId?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionUsersFilterInput = {
  and?: Array< ModelSubscriptionUsersFilterInput | null > | null,
  biography?: ModelSubscriptionStringInput | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  emailVisible?: ModelSubscriptionBooleanInput | null,
  id?: ModelSubscriptionIDInput | null,
  numberOfCanvases?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionUsersFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type GetAllCanvasIdsForAuthenticatedUserQueryVariables = {
  nextToken?: string | null,
  ownerUsername: string,
};

export type GetAllCanvasIdsForAuthenticatedUserQuery = {
  getAllCanvasIdsForAuthenticatedUser?:  {
    __typename: "getCanvasIdsForUserResponse",
    areCanvasIdsReturned: boolean,
    canvasIds?: Array< string > | null,
    errorMessage?: string | null,
    nextToken?: string | null,
  } | null,
};

export type GetCanvasCardQueryVariables = {
  canvasId: string,
};

export type GetCanvasCardQuery = {
  getCanvasCard?:  {
    __typename: "getCanvasCardResponse",
    canvasCard?:  {
      __typename: "canvasCard",
      description: string,
      likeCount: number,
      name: string,
      ownerUsername: string,
      publicity: string,
      thumbnail: string,
      viewCount: number,
    } | null,
    errorMessage?: string | null,
    isCanvasCardReturned: boolean,
  } | null,
};

export type GetCanvasDataQueryVariables = {
  canvasId: string,
};

export type GetCanvasDataQuery = {
  getCanvasData?:  {
    __typename: "getCanvasDataResponse",
    canvasData?:  {
      __typename: "canvasData",
      canvasData: string,
      description: string,
      likeCount: number,
      name: string,
      ownerUsername: string,
      publicity: string,
      viewCount: number,
    } | null,
    errorMessage?: string | null,
    isCanvasDataReturned: boolean,
  } | null,
};

export type GetCanvasLikesQueryVariables = {
  likeId: number,
  username: string,
};

export type GetCanvasLikesQuery = {
  getCanvasLikes?:  {
    __typename: "CanvasLikes",
    canvasId: string,
    cognitoId: string,
    createdAt: string,
    likeId: number,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type GetCanvasSocialStatsQueryVariables = {
  canvasId: string,
  ownerUsername: string,
};

export type GetCanvasSocialStatsQuery = {
  getCanvasSocialStats?:  {
    __typename: "CanvasSocialStats",
    canvasId: string,
    createdAt: string,
    likeCount: number,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    updatedAt: string,
    viewCount: number,
  } | null,
};

export type GetCanvasesQueryVariables = {
  canvasId: string,
  ownerUsername: string,
};

export type GetCanvasesQuery = {
  getCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description: string,
    name: string,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    publicity: string,
    updatedAt: string,
  } | null,
};

export type GetCanvasesDigestQueryVariables = {
  partitionKey: string,
  sortKey: number,
};

export type GetCanvasesDigestQuery = {
  getCanvasesDigest?:  {
    __typename: "CanvasesDigest",
    canvasId?: string | null,
    count?: number | null,
    createdAt: string,
    partitionKey: string,
    sortKey: number,
    updatedAt: string,
  } | null,
};

export type GetPublicCanvasIdsForUserQueryVariables = {
  nextToken?: string | null,
  ownerUsername: string,
};

export type GetPublicCanvasIdsForUserQuery = {
  getPublicCanvasIdsForUser?:  {
    __typename: "getCanvasIdsForUserResponse",
    areCanvasIdsReturned: boolean,
    canvasIds?: Array< string > | null,
    errorMessage?: string | null,
    nextToken?: string | null,
  } | null,
};

export type GetUserFollowersQueryVariables = {
  follower: string,
  username: string,
};

export type GetUserFollowersQuery = {
  getUserFollowers?:  {
    __typename: "UserFollowers",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    follower: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type GetUserFollowingQueryVariables = {
  following: string,
  username: string,
};

export type GetUserFollowingQuery = {
  getUserFollowing?:  {
    __typename: "UserFollowing",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    following: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type GetUsersQueryVariables = {
  username: string,
};

export type GetUsersQuery = {
  getUsers?:  {
    __typename: "Users",
    biography?: string | null,
    cognitoId?: string | null,
    createdAt: string,
    email?: string | null,
    emailVisible: boolean,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type ListCanvasLikesQueryVariables = {
  filter?: ModelCanvasLikesFilterInput | null,
  likeId?: ModelIntKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  username?: string | null,
};

export type ListCanvasLikesQuery = {
  listCanvasLikes?:  {
    __typename: "ModelCanvasLikesConnection",
    items:  Array< {
      __typename: "CanvasLikes",
      canvasId: string,
      cognitoId: string,
      createdAt: string,
      likeId: number,
      ownerCognitoId?: string | null,
      updatedAt: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCanvasLikesByCanvasIdAndUsernameQueryVariables = {
  canvasId: string,
  filter?: ModelCanvasLikesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  username?: ModelIDKeyConditionInput | null,
};

export type ListCanvasLikesByCanvasIdAndUsernameQuery = {
  listCanvasLikesByCanvasIdAndUsername?:  {
    __typename: "ModelCanvasLikesConnection",
    items:  Array< {
      __typename: "CanvasLikes",
      canvasId: string,
      cognitoId: string,
      createdAt: string,
      likeId: number,
      ownerCognitoId?: string | null,
      updatedAt: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCanvasSocialStatsQueryVariables = {
  canvasId?: ModelStringKeyConditionInput | null,
  filter?: ModelCanvasSocialStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  ownerUsername?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCanvasSocialStatsQuery = {
  listCanvasSocialStats?:  {
    __typename: "ModelCanvasSocialStatsConnection",
    items:  Array< {
      __typename: "CanvasSocialStats",
      canvasId: string,
      createdAt: string,
      likeCount: number,
      ownerCognitoId?: string | null,
      ownerUsername: string,
      updatedAt: string,
      viewCount: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCanvasSocialStatsByCanvasIdQueryVariables = {
  canvasId: string,
  filter?: ModelCanvasSocialStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCanvasSocialStatsByCanvasIdQuery = {
  listCanvasSocialStatsByCanvasId?:  {
    __typename: "ModelCanvasSocialStatsConnection",
    items:  Array< {
      __typename: "CanvasSocialStats",
      canvasId: string,
      createdAt: string,
      likeCount: number,
      ownerCognitoId?: string | null,
      ownerUsername: string,
      updatedAt: string,
      viewCount: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCanvasesQueryVariables = {
  canvasId?: ModelStringKeyConditionInput | null,
  filter?: ModelCanvasesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  ownerUsername?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCanvasesQuery = {
  listCanvases?:  {
    __typename: "ModelCanvasesConnection",
    items:  Array< {
      __typename: "Canvases",
      canvasId: string,
      createdAt: string,
      description: string,
      name: string,
      ownerCognitoId?: string | null,
      ownerUsername: string,
      publicity: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCanvasesByCanvasIdQueryVariables = {
  canvasId: string,
  filter?: ModelCanvasesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCanvasesByCanvasIdQuery = {
  listCanvasesByCanvasId?:  {
    __typename: "ModelCanvasesConnection",
    items:  Array< {
      __typename: "Canvases",
      canvasId: string,
      createdAt: string,
      description: string,
      name: string,
      ownerCognitoId?: string | null,
      ownerUsername: string,
      publicity: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCanvasesDigestByCanvasIdAndPartitionKeyQueryVariables = {
  canvasId: string,
  filter?: ModelCanvasesDigestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  partitionKey?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCanvasesDigestByCanvasIdAndPartitionKeyQuery = {
  listCanvasesDigestByCanvasIdAndPartitionKey?:  {
    __typename: "ModelCanvasesDigestConnection",
    items:  Array< {
      __typename: "CanvasesDigest",
      canvasId?: string | null,
      count?: number | null,
      createdAt: string,
      partitionKey: string,
      sortKey: number,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCanvasesDigestsQueryVariables = {
  filter?: ModelCanvasesDigestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  partitionKey?: string | null,
  sortDirection?: ModelSortDirection | null,
  sortKey?: ModelFloatKeyConditionInput | null,
};

export type ListCanvasesDigestsQuery = {
  listCanvasesDigests?:  {
    __typename: "ModelCanvasesDigestConnection",
    items:  Array< {
      __typename: "CanvasesDigest",
      canvasId?: string | null,
      count?: number | null,
      createdAt: string,
      partitionKey: string,
      sortKey: number,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserFollowersQueryVariables = {
  filter?: ModelUserFollowersFilterInput | null,
  follower?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  username?: string | null,
};

export type ListUserFollowersQuery = {
  listUserFollowers?:  {
    __typename: "ModelUserFollowersConnection",
    items:  Array< {
      __typename: "UserFollowers",
      cognitoId: string,
      createdAt: string,
      followDate: string,
      follower: string,
      ownerCognitoId?: string | null,
      updatedAt: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserFollowingsQueryVariables = {
  filter?: ModelUserFollowingFilterInput | null,
  following?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  username?: string | null,
};

export type ListUserFollowingsQuery = {
  listUserFollowings?:  {
    __typename: "ModelUserFollowingConnection",
    items:  Array< {
      __typename: "UserFollowing",
      cognitoId: string,
      createdAt: string,
      followDate: string,
      following: string,
      ownerCognitoId?: string | null,
      updatedAt: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUsersFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  username?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUsersConnection",
    items:  Array< {
      __typename: "Users",
      biography?: string | null,
      cognitoId?: string | null,
      createdAt: string,
      email?: string | null,
      emailVisible: boolean,
      numberOfCanvases?: number | null,
      updatedAt: string,
      username: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ResendConfirmationCodeQueryVariables = {
  cognitoClientId: string,
  email: string,
};

export type ResendConfirmationCodeQuery = {
  resendConfirmationCode?:  {
    __typename: "resendConfirmationCodeResponse",
    errorMessage?: string | null,
    isConfirmationCodeResent: boolean,
    userId?: string | null,
  } | null,
};

export type ChangeBioForUserMutationVariables = {
  newBio?: string | null,
  username: string,
};

export type ChangeBioForUserMutation = {
  changeBioForUser?:  {
    __typename: "changeBioForUserResponse",
    errorMessage?: string | null,
    isBioChanged: boolean,
  } | null,
};

export type CreateCanvasForUserMutationVariables = {
  canvasData: string,
  canvasId?: string | null,
  canvasThumbail: string,
  description: string,
  name: string,
  ownerUsername: string,
  publicity: string,
};

export type CreateCanvasForUserMutation = {
  createCanvasForUser?:  {
    __typename: "createCanvasForUserResponse",
    canvasId?: string | null,
    errorMessage?: string | null,
    isCanvasSaved: boolean,
  } | null,
};

export type CreateCanvasLikesMutationVariables = {
  condition?: ModelCanvasLikesConditionInput | null,
  input: CreateCanvasLikesInput,
};

export type CreateCanvasLikesMutation = {
  createCanvasLikes?:  {
    __typename: "CanvasLikes",
    canvasId: string,
    cognitoId: string,
    createdAt: string,
    likeId: number,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type CreateCanvasSocialStatsMutationVariables = {
  condition?: ModelCanvasSocialStatsConditionInput | null,
  input: CreateCanvasSocialStatsInput,
};

export type CreateCanvasSocialStatsMutation = {
  createCanvasSocialStats?:  {
    __typename: "CanvasSocialStats",
    canvasId: string,
    createdAt: string,
    likeCount: number,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    updatedAt: string,
    viewCount: number,
  } | null,
};

export type CreateCanvasesMutationVariables = {
  condition?: ModelCanvasesConditionInput | null,
  input: CreateCanvasesInput,
};

export type CreateCanvasesMutation = {
  createCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description: string,
    name: string,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    publicity: string,
    updatedAt: string,
  } | null,
};

export type CreateCanvasesDigestMutationVariables = {
  condition?: ModelCanvasesDigestConditionInput | null,
  input: CreateCanvasesDigestInput,
};

export type CreateCanvasesDigestMutation = {
  createCanvasesDigest?:  {
    __typename: "CanvasesDigest",
    canvasId?: string | null,
    count?: number | null,
    createdAt: string,
    partitionKey: string,
    sortKey: number,
    updatedAt: string,
  } | null,
};

export type CreateUserFollowersMutationVariables = {
  condition?: ModelUserFollowersConditionInput | null,
  input: CreateUserFollowersInput,
};

export type CreateUserFollowersMutation = {
  createUserFollowers?:  {
    __typename: "UserFollowers",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    follower: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type CreateUserFollowingMutationVariables = {
  condition?: ModelUserFollowingConditionInput | null,
  input: CreateUserFollowingInput,
};

export type CreateUserFollowingMutation = {
  createUserFollowing?:  {
    __typename: "UserFollowing",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    following: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type CreateUsersMutationVariables = {
  condition?: ModelUsersConditionInput | null,
  input: CreateUsersInput,
};

export type CreateUsersMutation = {
  createUsers?:  {
    __typename: "Users",
    biography?: string | null,
    cognitoId?: string | null,
    createdAt: string,
    email?: string | null,
    emailVisible: boolean,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type DeleteCanvasForUserMutationVariables = {
  canvasId: string,
};

export type DeleteCanvasForUserMutation = {
  deleteCanvasForUser?:  {
    __typename: "deleteCanvasForUserResponse",
    errorMessage?: string | null,
    isCanvasDeleted: boolean,
  } | null,
};

export type DeleteCanvasLikesMutationVariables = {
  condition?: ModelCanvasLikesConditionInput | null,
  input: DeleteCanvasLikesInput,
};

export type DeleteCanvasLikesMutation = {
  deleteCanvasLikes?:  {
    __typename: "CanvasLikes",
    canvasId: string,
    cognitoId: string,
    createdAt: string,
    likeId: number,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type DeleteCanvasSocialStatsMutationVariables = {
  condition?: ModelCanvasSocialStatsConditionInput | null,
  input: DeleteCanvasSocialStatsInput,
};

export type DeleteCanvasSocialStatsMutation = {
  deleteCanvasSocialStats?:  {
    __typename: "CanvasSocialStats",
    canvasId: string,
    createdAt: string,
    likeCount: number,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    updatedAt: string,
    viewCount: number,
  } | null,
};

export type DeleteCanvasesMutationVariables = {
  condition?: ModelCanvasesConditionInput | null,
  input: DeleteCanvasesInput,
};

export type DeleteCanvasesMutation = {
  deleteCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description: string,
    name: string,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    publicity: string,
    updatedAt: string,
  } | null,
};

export type DeleteCanvasesDigestMutationVariables = {
  condition?: ModelCanvasesDigestConditionInput | null,
  input: DeleteCanvasesDigestInput,
};

export type DeleteCanvasesDigestMutation = {
  deleteCanvasesDigest?:  {
    __typename: "CanvasesDigest",
    canvasId?: string | null,
    count?: number | null,
    createdAt: string,
    partitionKey: string,
    sortKey: number,
    updatedAt: string,
  } | null,
};

export type DeleteUserFollowersMutationVariables = {
  condition?: ModelUserFollowersConditionInput | null,
  input: DeleteUserFollowersInput,
};

export type DeleteUserFollowersMutation = {
  deleteUserFollowers?:  {
    __typename: "UserFollowers",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    follower: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type DeleteUserFollowingMutationVariables = {
  condition?: ModelUserFollowingConditionInput | null,
  input: DeleteUserFollowingInput,
};

export type DeleteUserFollowingMutation = {
  deleteUserFollowing?:  {
    __typename: "UserFollowing",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    following: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type DeleteUsersMutationVariables = {
  condition?: ModelUsersConditionInput | null,
  input: DeleteUsersInput,
};

export type DeleteUsersMutation = {
  deleteUsers?:  {
    __typename: "Users",
    biography?: string | null,
    cognitoId?: string | null,
    createdAt: string,
    email?: string | null,
    emailVisible: boolean,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type FollowUserMutationVariables = {
  unfollow: boolean,
  userToFollow: string,
  username: string,
};

export type FollowUserMutation = {
  followUser?:  {
    __typename: "followUserResponse",
    errorMessage?: string | null,
    isUserFollowed: boolean,
  } | null,
};

export type LikeCanvasForUserMutationVariables = {
  canvasId: string,
  removeLike: boolean,
  username: string,
};

export type LikeCanvasForUserMutation = {
  likeCanvasForUser?:  {
    __typename: "likeCanvasForUserResponse",
    errorMessage?: string | null,
    isCanvasLiked: boolean,
  } | null,
};

export type UpdateCanvasLikesMutationVariables = {
  condition?: ModelCanvasLikesConditionInput | null,
  input: UpdateCanvasLikesInput,
};

export type UpdateCanvasLikesMutation = {
  updateCanvasLikes?:  {
    __typename: "CanvasLikes",
    canvasId: string,
    cognitoId: string,
    createdAt: string,
    likeId: number,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type UpdateCanvasSocialStatsMutationVariables = {
  condition?: ModelCanvasSocialStatsConditionInput | null,
  input: UpdateCanvasSocialStatsInput,
};

export type UpdateCanvasSocialStatsMutation = {
  updateCanvasSocialStats?:  {
    __typename: "CanvasSocialStats",
    canvasId: string,
    createdAt: string,
    likeCount: number,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    updatedAt: string,
    viewCount: number,
  } | null,
};

export type UpdateCanvasesMutationVariables = {
  condition?: ModelCanvasesConditionInput | null,
  input: UpdateCanvasesInput,
};

export type UpdateCanvasesMutation = {
  updateCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description: string,
    name: string,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    publicity: string,
    updatedAt: string,
  } | null,
};

export type UpdateCanvasesDigestMutationVariables = {
  condition?: ModelCanvasesDigestConditionInput | null,
  input: UpdateCanvasesDigestInput,
};

export type UpdateCanvasesDigestMutation = {
  updateCanvasesDigest?:  {
    __typename: "CanvasesDigest",
    canvasId?: string | null,
    count?: number | null,
    createdAt: string,
    partitionKey: string,
    sortKey: number,
    updatedAt: string,
  } | null,
};

export type UpdateUserFollowersMutationVariables = {
  condition?: ModelUserFollowersConditionInput | null,
  input: UpdateUserFollowersInput,
};

export type UpdateUserFollowersMutation = {
  updateUserFollowers?:  {
    __typename: "UserFollowers",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    follower: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type UpdateUserFollowingMutationVariables = {
  condition?: ModelUserFollowingConditionInput | null,
  input: UpdateUserFollowingInput,
};

export type UpdateUserFollowingMutation = {
  updateUserFollowing?:  {
    __typename: "UserFollowing",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    following: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type UpdateUsersMutationVariables = {
  condition?: ModelUsersConditionInput | null,
  input: UpdateUsersInput,
};

export type UpdateUsersMutation = {
  updateUsers?:  {
    __typename: "Users",
    biography?: string | null,
    cognitoId?: string | null,
    createdAt: string,
    email?: string | null,
    emailVisible: boolean,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnCreateCanvasLikesSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionCanvasLikesFilterInput | null,
};

export type OnCreateCanvasLikesSubscription = {
  onCreateCanvasLikes?:  {
    __typename: "CanvasLikes",
    canvasId: string,
    cognitoId: string,
    createdAt: string,
    likeId: number,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnCreateCanvasSocialStatsSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasSocialStatsFilterInput | null,
  ownerCognitoId?: string | null,
};

export type OnCreateCanvasSocialStatsSubscription = {
  onCreateCanvasSocialStats?:  {
    __typename: "CanvasSocialStats",
    canvasId: string,
    createdAt: string,
    likeCount: number,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    updatedAt: string,
    viewCount: number,
  } | null,
};

export type OnCreateCanvasesSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesFilterInput | null,
  ownerCognitoId?: string | null,
};

export type OnCreateCanvasesSubscription = {
  onCreateCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description: string,
    name: string,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    publicity: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCanvasesDigestSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesDigestFilterInput | null,
};

export type OnCreateCanvasesDigestSubscription = {
  onCreateCanvasesDigest?:  {
    __typename: "CanvasesDigest",
    canvasId?: string | null,
    count?: number | null,
    createdAt: string,
    partitionKey: string,
    sortKey: number,
    updatedAt: string,
  } | null,
};

export type OnCreateUserFollowersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUserFollowersFilterInput | null,
};

export type OnCreateUserFollowersSubscription = {
  onCreateUserFollowers?:  {
    __typename: "UserFollowers",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    follower: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnCreateUserFollowingSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUserFollowingFilterInput | null,
};

export type OnCreateUserFollowingSubscription = {
  onCreateUserFollowing?:  {
    __typename: "UserFollowing",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    following: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnCreateUsersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnCreateUsersSubscription = {
  onCreateUsers?:  {
    __typename: "Users",
    biography?: string | null,
    cognitoId?: string | null,
    createdAt: string,
    email?: string | null,
    emailVisible: boolean,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnDeleteCanvasLikesSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionCanvasLikesFilterInput | null,
};

export type OnDeleteCanvasLikesSubscription = {
  onDeleteCanvasLikes?:  {
    __typename: "CanvasLikes",
    canvasId: string,
    cognitoId: string,
    createdAt: string,
    likeId: number,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnDeleteCanvasSocialStatsSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasSocialStatsFilterInput | null,
  ownerCognitoId?: string | null,
};

export type OnDeleteCanvasSocialStatsSubscription = {
  onDeleteCanvasSocialStats?:  {
    __typename: "CanvasSocialStats",
    canvasId: string,
    createdAt: string,
    likeCount: number,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    updatedAt: string,
    viewCount: number,
  } | null,
};

export type OnDeleteCanvasesSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesFilterInput | null,
  ownerCognitoId?: string | null,
};

export type OnDeleteCanvasesSubscription = {
  onDeleteCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description: string,
    name: string,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    publicity: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCanvasesDigestSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesDigestFilterInput | null,
};

export type OnDeleteCanvasesDigestSubscription = {
  onDeleteCanvasesDigest?:  {
    __typename: "CanvasesDigest",
    canvasId?: string | null,
    count?: number | null,
    createdAt: string,
    partitionKey: string,
    sortKey: number,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserFollowersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUserFollowersFilterInput | null,
};

export type OnDeleteUserFollowersSubscription = {
  onDeleteUserFollowers?:  {
    __typename: "UserFollowers",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    follower: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnDeleteUserFollowingSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUserFollowingFilterInput | null,
};

export type OnDeleteUserFollowingSubscription = {
  onDeleteUserFollowing?:  {
    __typename: "UserFollowing",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    following: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnDeleteUsersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnDeleteUsersSubscription = {
  onDeleteUsers?:  {
    __typename: "Users",
    biography?: string | null,
    cognitoId?: string | null,
    createdAt: string,
    email?: string | null,
    emailVisible: boolean,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnUpdateCanvasLikesSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionCanvasLikesFilterInput | null,
};

export type OnUpdateCanvasLikesSubscription = {
  onUpdateCanvasLikes?:  {
    __typename: "CanvasLikes",
    canvasId: string,
    cognitoId: string,
    createdAt: string,
    likeId: number,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnUpdateCanvasSocialStatsSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasSocialStatsFilterInput | null,
  ownerCognitoId?: string | null,
};

export type OnUpdateCanvasSocialStatsSubscription = {
  onUpdateCanvasSocialStats?:  {
    __typename: "CanvasSocialStats",
    canvasId: string,
    createdAt: string,
    likeCount: number,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    updatedAt: string,
    viewCount: number,
  } | null,
};

export type OnUpdateCanvasesSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesFilterInput | null,
  ownerCognitoId?: string | null,
};

export type OnUpdateCanvasesSubscription = {
  onUpdateCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description: string,
    name: string,
    ownerCognitoId?: string | null,
    ownerUsername: string,
    publicity: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCanvasesDigestSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesDigestFilterInput | null,
};

export type OnUpdateCanvasesDigestSubscription = {
  onUpdateCanvasesDigest?:  {
    __typename: "CanvasesDigest",
    canvasId?: string | null,
    count?: number | null,
    createdAt: string,
    partitionKey: string,
    sortKey: number,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserFollowersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUserFollowersFilterInput | null,
};

export type OnUpdateUserFollowersSubscription = {
  onUpdateUserFollowers?:  {
    __typename: "UserFollowers",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    follower: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnUpdateUserFollowingSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUserFollowingFilterInput | null,
};

export type OnUpdateUserFollowingSubscription = {
  onUpdateUserFollowing?:  {
    __typename: "UserFollowing",
    cognitoId: string,
    createdAt: string,
    followDate: string,
    following: string,
    ownerCognitoId?: string | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type OnUpdateUsersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnUpdateUsersSubscription = {
  onUpdateUsers?:  {
    __typename: "Users",
    biography?: string | null,
    cognitoId?: string | null,
    createdAt: string,
    email?: string | null,
    emailVisible: boolean,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};
