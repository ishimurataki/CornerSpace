import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createCanvasForUser } from './functions/create-canvas-for-user/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  storage,
  createCanvasForUser
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

backend.createCanvasForUser.resources.lambda.addToRolePolicy(ddbReadPolicy)