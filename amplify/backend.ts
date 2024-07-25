import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createCanvasForUser } from './functions/create-canvas-for-user/resource';
import { getPublicCanvasIdsForUser } from './functions/get-public-canvas-ids-for-user/resource';
import { getAllCanvasIdsForAuthenticatedUser } from './functions/get-all-canvas-ids-for-authenticated-user/resource';
import { getCanvasCard } from './functions/get-canvas-card/resource';
import { getCanvasData } from './functions/get-canvas-data/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { deleteCanvasForUser } from './functions/delete-canvas-for-user/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  createCanvasForUser,
  deleteCanvasForUser,
  getPublicCanvasIdsForUser,
  getAllCanvasIdsForAuthenticatedUser,
  getCanvasCard,
  getCanvasData
});

let ddbReadPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    "dynamodb:BatchGetItem",
    "dynamodb:GetItem",
    "dynamodb:Scan",
    "dynamodb:Query",
    "dynamodb:GetRecords"],
  resources: ['*'] // Table ARN is needed here.
})

backend.createCanvasForUser.resources.lambda.addToRolePolicy(ddbReadPolicy);
backend.deleteCanvasForUser.resources.lambda.addToRolePolicy(ddbReadPolicy);
backend.getPublicCanvasIdsForUser.resources.lambda.addToRolePolicy(ddbReadPolicy);
backend.getAllCanvasIdsForAuthenticatedUser.resources.lambda.addToRolePolicy(ddbReadPolicy);
backend.getCanvasCard.resources.lambda.addToRolePolicy(ddbReadPolicy);
backend.getCanvasData.resources.lambda.addToRolePolicy(ddbReadPolicy);