import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createCanvasForUser } from './functions/create-canvas-for-user/resource';
import { getPublicCanvasIdsForUser } from './functions/get-public-canvas-ids-for-user/resource';
import { getAllCanvasIdsForAuthenticatedUser } from './functions/get-all-canvas-ids-for-authenticated-user/resource';
import { getCanvasCard } from './functions/get-canvas-card/resource';
import { getCanvasData } from './functions/get-canvas-data/resource';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { deleteCanvasForUser } from './functions/delete-canvas-for-user/resource';
import { canvasesStreamingEvent } from './functions/canvases-streaming-event/resource';
import { canvasLikesStreamingEvent } from './functions/canvas-likes-streaming-event/resource';
import { EventSourceMapping, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { Stack } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
  storage,
  createCanvasForUser,
  deleteCanvasForUser,
  getPublicCanvasIdsForUser,
  getAllCanvasIdsForAuthenticatedUser,
  getCanvasCard,
  getCanvasData,
  canvasesStreamingEvent,
  canvasLikesStreamingEvent
});

let ddbReadWritePolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    "dynamodb:BatchGetItem",
    "dynamodb:GetItem",
    "dynamodb:Scan",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:Query",
    "dynamodb:GetRecords",
    "dynamodb:DeleteItem",
    "dynamodb:BatchWriteItem"
  ],
  resources: ['*']
})

const canvasesTable = backend.data.resources.tables["Canvases"];
backend.canvasesStreamingEvent.resources.lambda.role?.attachInlinePolicy(
  new Policy(
    Stack.of(canvasesTable),
    "DynamoDBPolicy",
    {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "dynamodb:DescribeStream",
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator",
            "dynamodb:ListStreams",
          ],
          resources: ["*"],
        }),
      ],
    }
  )
);
backend.canvasesStreamingEvent.resources.lambda.addToRolePolicy(ddbReadWritePolicy);

new EventSourceMapping(
  Stack.of(canvasesTable),
  "CanvasesStreamingEventSourceMapping",
  {
    target: backend.canvasesStreamingEvent.resources.lambda,
    eventSourceArn: canvasesTable.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

const canvasLikesTable = backend.data.resources.tables["CanvasLikes"];
backend.canvasLikesStreamingEvent.resources.lambda.role?.attachInlinePolicy(
  new Policy(
    Stack.of(canvasLikesTable),
    "DynamoDBPolicy",
    {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "dynamodb:DescribeStream",
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator",
            "dynamodb:ListStreams",
          ],
          resources: ["*"],
        }),
      ],
    }
  )
);
backend.canvasLikesStreamingEvent.resources.lambda.addToRolePolicy(ddbReadWritePolicy);

new EventSourceMapping(
  Stack.of(canvasLikesTable),
  "CanvasLikesStreamingEventSourceMapping",
  {
    target: backend.canvasLikesStreamingEvent.resources.lambda,
    eventSourceArn: canvasLikesTable.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);