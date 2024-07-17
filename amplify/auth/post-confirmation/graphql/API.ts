/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Canvases = {
  __typename: "Canvases",
  canvasId: string,
  createdAt: string,
  description?: string | null,
  name: string,
  owner?: string | null,
  ownerUsername: string,
  publicity?: CanvasesPublicity | null,
  updatedAt: string,
};

export enum CanvasesPublicity {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}


export type Users = {
  __typename: "Users",
  cognitoId?: string | null,
  createdAt: string,
  numberOfCanvases?: number | null,
  updatedAt: string,
  username: string,
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

export type ModelCanvasesFilterInput = {
  and?: Array< ModelCanvasesFilterInput | null > | null,
  canvasId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelCanvasesFilterInput | null,
  or?: Array< ModelCanvasesFilterInput | null > | null,
  owner?: ModelStringInput | null,
  ownerUsername?: ModelIDInput | null,
  publicity?: ModelCanvasesPublicityInput | null,
  updatedAt?: ModelStringInput | null,
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

export type ModelCanvasesPublicityInput = {
  eq?: CanvasesPublicity | null,
  ne?: CanvasesPublicity | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


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

export type ModelUsersConnection = {
  __typename: "ModelUsersConnection",
  items:  Array<Users | null >,
  nextToken?: string | null,
};

export type ModelCanvasesConditionInput = {
  and?: Array< ModelCanvasesConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelCanvasesConditionInput | null,
  or?: Array< ModelCanvasesConditionInput | null > | null,
  owner?: ModelStringInput | null,
  publicity?: ModelCanvasesPublicityInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCanvasesInput = {
  canvasId: string,
  description?: string | null,
  name: string,
  ownerUsername: string,
  publicity?: CanvasesPublicity | null,
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

export type DeleteCanvasesInput = {
  canvasId: string,
  ownerUsername: string,
};

export type DeleteUsersInput = {
  username: string,
};

export type UpdateCanvasesInput = {
  canvasId: string,
  description?: string | null,
  name?: string | null,
  ownerUsername: string,
  publicity?: CanvasesPublicity | null,
};

export type UpdateUsersInput = {
  cognitoId?: string | null,
  numberOfCanvases?: number | null,
  username: string,
};

export type ModelSubscriptionCanvasesFilterInput = {
  and?: Array< ModelSubscriptionCanvasesFilterInput | null > | null,
  canvasId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCanvasesFilterInput | null > | null,
  owner?: ModelStringInput | null,
  ownerUsername?: ModelSubscriptionIDInput | null,
  publicity?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
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

export type GetCanvasesQueryVariables = {
  canvasId: string,
  ownerUsername: string,
};

export type GetCanvasesQuery = {
  getCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
    updatedAt: string,
  } | null,
};

export type GetCanvasesForUserQueryVariables = {
  user: string,
};

export type GetCanvasesForUserQuery = {
  getCanvasesForUser?:  Array< {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
    updatedAt: string,
  } | null > | null,
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
      description?: string | null,
      name: string,
      owner?: string | null,
      ownerUsername: string,
      publicity?: CanvasesPublicity | null,
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
      description?: string | null,
      name: string,
      owner?: string | null,
      ownerUsername: string,
      publicity?: CanvasesPublicity | null,
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

export type CreateCanvasesMutationVariables = {
  condition?: ModelCanvasesConditionInput | null,
  input: CreateCanvasesInput,
};

export type CreateCanvasesMutation = {
  createCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
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

export type DeleteCanvasesMutationVariables = {
  condition?: ModelCanvasesConditionInput | null,
  input: DeleteCanvasesInput,
};

export type DeleteCanvasesMutation = {
  deleteCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
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

export type UpdateCanvasesMutationVariables = {
  condition?: ModelCanvasesConditionInput | null,
  input: UpdateCanvasesInput,
};

export type UpdateCanvasesMutation = {
  updateCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
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

export type OnCreateCanvasesSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesFilterInput | null,
  owner?: string | null,
};

export type OnCreateCanvasesSubscription = {
  onCreateCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
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

export type OnDeleteCanvasesSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCanvasesSubscription = {
  onDeleteCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
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

export type OnUpdateCanvasesSubscriptionVariables = {
  filter?: ModelSubscriptionCanvasesFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCanvasesSubscription = {
  onUpdateCanvases?:  {
    __typename: "Canvases",
    canvasId: string,
    createdAt: string,
    description?: string | null,
    name: string,
    owner?: string | null,
    ownerUsername: string,
    publicity?: CanvasesPublicity | null,
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
