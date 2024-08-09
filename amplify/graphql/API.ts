/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type getCanvasIdsForUserResponse = {
  __typename: "getCanvasIdsForUserResponse",
  areCanvasIdsReturned: boolean,
  canvasIds?: Array< string > | null,
  errorMessage?: string | null,
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

export type Users = {
  __typename: "Users",
  cognitoId?: string | null,
  createdAt: string,
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

export type ModelUsersFilterInput = {
  and?: Array< ModelUsersFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelUsersFilterInput | null,
  numberOfCanvases?: ModelIntInput | null,
  or?: Array< ModelUsersFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelIDInput | null,
};

export type ModelUsersConnection = {
  __typename: "ModelUsersConnection",
  items:  Array<Users | null >,
  nextToken?: string | null,
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

export type ModelUsersConditionInput = {
  and?: Array< ModelUsersConditionInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelUsersConditionInput | null,
  numberOfCanvases?: ModelIntInput | null,
  or?: Array< ModelUsersConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUsersInput = {
  cognitoId?: string | null,
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

export type DeleteUsersInput = {
  username: string,
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

export type UpdateUsersInput = {
  cognitoId?: string | null,
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

export type ModelSubscriptionUsersFilterInput = {
  and?: Array< ModelSubscriptionUsersFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  numberOfCanvases?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionUsersFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionIDInput | null,
};

export type GetAllCanvasIdsForAuthenticatedUserQueryVariables = {
  ownerUsername: string,
};

export type GetAllCanvasIdsForAuthenticatedUserQuery = {
  getAllCanvasIdsForAuthenticatedUser?:  {
    __typename: "getCanvasIdsForUserResponse",
    areCanvasIdsReturned: boolean,
    canvasIds?: Array< string > | null,
    errorMessage?: string | null,
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

export type GetPublicCanvasIdsForUserQueryVariables = {
  ownerUsername: string,
};

export type GetPublicCanvasIdsForUserQuery = {
  getPublicCanvasIdsForUser?:  {
    __typename: "getCanvasIdsForUserResponse",
    areCanvasIdsReturned: boolean,
    canvasIds?: Array< string > | null,
    errorMessage?: string | null,
  } | null,
};

export type GetUsersQueryVariables = {
  username: string,
};

export type GetUsersQuery = {
  getUsers?:  {
    __typename: "Users",
    cognitoId?: string | null,
    createdAt: string,
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
      cognitoId?: string | null,
      createdAt: string,
      numberOfCanvases?: number | null,
      updatedAt: string,
      username: string,
    } | null >,
    nextToken?: string | null,
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

export type CreateUsersMutationVariables = {
  condition?: ModelUsersConditionInput | null,
  input: CreateUsersInput,
};

export type CreateUsersMutation = {
  createUsers?:  {
    __typename: "Users",
    cognitoId?: string | null,
    createdAt: string,
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

export type DeleteUsersMutationVariables = {
  condition?: ModelUsersConditionInput | null,
  input: DeleteUsersInput,
};

export type DeleteUsersMutation = {
  deleteUsers?:  {
    __typename: "Users",
    cognitoId?: string | null,
    createdAt: string,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};

export type LikeCanvasForUserMutationVariables = {
  canvasId: string,
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

export type UpdateUsersMutationVariables = {
  condition?: ModelUsersConditionInput | null,
  input: UpdateUsersInput,
};

export type UpdateUsersMutation = {
  updateUsers?:  {
    __typename: "Users",
    cognitoId?: string | null,
    createdAt: string,
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

export type OnCreateUsersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnCreateUsersSubscription = {
  onCreateUsers?:  {
    __typename: "Users",
    cognitoId?: string | null,
    createdAt: string,
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

export type OnDeleteUsersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnDeleteUsersSubscription = {
  onDeleteUsers?:  {
    __typename: "Users",
    cognitoId?: string | null,
    createdAt: string,
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

export type OnUpdateUsersSubscriptionVariables = {
  cognitoId?: string | null,
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnUpdateUsersSubscription = {
  onUpdateUsers?:  {
    __typename: "Users",
    cognitoId?: string | null,
    createdAt: string,
    numberOfCanvases?: number | null,
    updatedAt: string,
    username: string,
  } | null,
};
