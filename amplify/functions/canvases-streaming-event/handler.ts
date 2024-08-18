import type { DynamoDBStreamHandler } from 'aws-lambda';
import { BatchWriteItemCommand, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient({});

const EPOCH_01_01_2024 = Date.parse("01 Jan 2024 00:00:00 GMT");
const CANVASES_DIGEST_TABLE_NAME = "CanvasesDigest-ny7dviy5njboxk6q65y6zqeloi-NONE";
const CANVASES_SOCIAL_STATS_TABLE = "CanvasSocialStats-ny7dviy5njboxk6q65y6zqeloi-NONE";
const CANVASES_LIKES_TABLE = "CanvasLikes-ny7dviy5njboxk6q65y6zqeloi-NONE";
const MAX_NEW_CANVASES_IN_DIGEST_TABLE = 4;

export const handler: DynamoDBStreamHandler = async (event) => {

    try {
        for (const record of event.Records) {

            const currentTimeISO = new Date(Date.now()).toISOString();

            if (record.eventName === "INSERT" && record.dynamodb?.NewImage) {
                console.log("DDB Streams handler triggered for Canvases table: INSERT event.");

                const canvasCreatedAt = record.dynamodb.NewImage.createdAt.S;
                const canvasId = record.dynamodb.NewImage.canvasId.S;
                const ownerUsername = record.dynamodb.NewImage.ownerUsername.S;
                const ownerCognitoId = record.dynamodb.NewImage.ownerCognitoId.S;
                if (!canvasCreatedAt || !canvasId || !ownerUsername || !ownerCognitoId) {
                    console.log("Either ownerUsername, ownerCognitoId, creation date, or canvasId missing from record.");
                    return;
                }

                // Create social-stats record in CanvasSocialStats table
                const putSocialStatsCommand = new PutItemCommand({
                    Item: {
                        ownerUsername: { S: ownerUsername },
                        canvasId: { S: canvasId },
                        ownerCognitoId: { S: ownerCognitoId },
                        likeCount: { N: "0" },
                        viewCount: { N: "0" },
                        __typename: { S: "CanvasLikes" },
                        createdAt: { S: currentTimeISO },
                        updatedAt: { S: currentTimeISO }
                    },
                    TableName: CANVASES_SOCIAL_STATS_TABLE
                });
                const putSocialStatsCommandResponse = await dynamoDBClient.send(putSocialStatsCommand);
                if (putSocialStatsCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB get command failed for creating social stats record SocialStats table.");
                }

                // Append new canvas record in CanvasesDigest table
                let newCanvasesRecordCountInDigestTable = 0;
                const getCommand = new GetItemCommand({
                    Key: {
                        partitionKey: { S: "canvases#new#count" },
                        sortKey: { N: "0" }
                    },
                    TableName: CANVASES_DIGEST_TABLE_NAME
                });
                const getCommandResponse = await dynamoDBClient.send(getCommand);
                if (getCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB get command failed for retrieving canvases#new#count.");
                    return;
                }
                if (!getCommandResponse.Item) {
                    const createCommand = new PutItemCommand({
                        Item: {
                            partitionKey: { S: "canvases#new#count" },
                            sortKey: { N: "0" },
                            count: { N: "0" },
                            __typename: { S: "CanvasesDigest" },
                            createdAt: { S: currentTimeISO },
                            updatedAt: { S: currentTimeISO }
                        },
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });
                    const createCommandResponse = await dynamoDBClient.send(createCommand);
                    if (createCommandResponse.$metadata.httpStatusCode !== 200) {
                        console.log("DDB get create failed for initializing canvases#new#count.");
                        return;
                    }
                } else if (getCommandResponse.Item.count.N) {
                    newCanvasesRecordCountInDigestTable = Number(getCommandResponse.Item.count.N);
                }
                console.log("Numer of new canvases in digest table is: " + String(newCanvasesRecordCountInDigestTable));

                if (newCanvasesRecordCountInDigestTable < MAX_NEW_CANVASES_IN_DIGEST_TABLE) {
                    const newCountString = String(newCanvasesRecordCountInDigestTable + 1);
                    const updateCommand = new UpdateItemCommand({
                        Key: {
                            partitionKey: { S: "canvases#new#count" },
                            sortKey: { N: "0" },
                        },
                        UpdateExpression: "SET #count = :count",
                        ExpressionAttributeNames: {
                            "#count": "count",
                        },
                        ExpressionAttributeValues: {
                            ":count": { "N": newCountString },
                        },
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });
                    const updateCommandResponse = await dynamoDBClient.send(updateCommand);
                    if (updateCommandResponse.$metadata.httpStatusCode !== 200) {
                        console.log("DDB update command failed for updating new canvases count.");
                        return;
                    }
                } else {
                    const queryCommand = new QueryCommand({
                        ExpressionAttributeValues: {
                            ":partitionKeyValue": { "S": "canvases#new" },
                        },
                        KeyConditionExpression: "partitionKey = :partitionKeyValue",
                        Limit: 1,
                        ScanIndexForward: true,
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });

                    const queryCommandResponse = await dynamoDBClient.send(queryCommand);
                    if (queryCommandResponse.$metadata.httpStatusCode !== 200
                        || !queryCommandResponse.Items || queryCommandResponse.Items.length < 1) {
                        console.log("DDB query command failed for retrieving oldest new canvas record.");
                        return;
                    }

                    const canvasToEvictSortKey = queryCommandResponse.Items[0].sortKey.N;
                    if (!canvasToEvictSortKey) {
                        console.log("Sort key missing for oldest new canvas record.");
                        return;
                    }

                    const deleteCommand = new DeleteItemCommand({
                        Key: {
                            partitionKey: { S: "canvases#new" },
                            sortKey: { N: canvasToEvictSortKey },
                        },
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });
                    const deleteCommandResponse = await dynamoDBClient.send(deleteCommand);
                    if (deleteCommandResponse.$metadata.httpStatusCode !== 200) {
                        console.log("DDB delete command failed for deleting oldest new canvas record.");
                        return;
                    }
                }

                const creationEpochString = String(Date.parse(canvasCreatedAt) - EPOCH_01_01_2024);
                const putCommand = new PutItemCommand({
                    Item: {
                        partitionKey: { S: "canvases#new" },
                        sortKey: { N: creationEpochString },
                        canvasId: { S: canvasId },
                        __typename: { S: "CanvasesDigest" },
                        createdAt: { S: currentTimeISO },
                        updatedAt: { S: currentTimeISO }
                    },
                    TableName: CANVASES_DIGEST_TABLE_NAME
                });
                const putCommandResponse = await dynamoDBClient.send(putCommand);
                if (putCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB put command failed for creating new canvas record.");
                    return;
                }
            } else if (record.eventName === "REMOVE" && record.dynamodb?.OldImage) {
                console.log("DDB Streams handler triggered for Canvases table: REMOVE event.");

                const canvasCreatedAt = record.dynamodb.OldImage.createdAt.S;
                const canvasId = record.dynamodb.OldImage.canvasId.S;
                const ownerUsername = record.dynamodb.OldImage.ownerUsername.S;
                const ownerCognitoId = record.dynamodb.OldImage.ownerCognitoId.S;
                if (!canvasCreatedAt || !canvasId || !ownerUsername || !ownerCognitoId) {
                    console.log("Either ownerUsername, ownerCognitoId, creation date, or canvasId missing from record.");
                    return;
                }

                // Delete social-stats record in CanvasSocialStats table
                const deleteSocialStatsCommand = new DeleteItemCommand({
                    Key: {
                        ownerUsername: { S: ownerUsername },
                        canvasId: { S: canvasId },
                    },
                    TableName: CANVASES_SOCIAL_STATS_TABLE
                });
                const deleteSocialStatsCommandResponse = await dynamoDBClient.send(deleteSocialStatsCommand);
                if (deleteSocialStatsCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB delete command failed for deleting social stats record SocialStats table.");
                }

                // Delete all like records in CanvasLikes table
                const queryLikesCommand = new QueryCommand({
                    ExpressionAttributeValues: {
                        ":username": { "S": ownerUsername },
                    },
                    KeyConditionExpression: "username = :username",
                    TableName: CANVASES_LIKES_TABLE
                });

                const queryLikesCommandResponse = await dynamoDBClient.send(queryLikesCommand);
                if (queryLikesCommandResponse.$metadata.httpStatusCode !== 200 || !queryLikesCommandResponse.Items) {
                    console.log("DDB query command failed for retrieving all likes associated with canvas.");
                } else if (queryLikesCommandResponse.Items.length > 0) {
                    const batchDeleteLikesCommand = new BatchWriteItemCommand({
                        RequestItems: {
                            [CANVASES_LIKES_TABLE]: queryLikesCommandResponse.Items.map((item) => {
                                return {
                                    DeleteRequest: {
                                        Key: {
                                            username: item.username,
                                            likeId: item.likeId
                                        }
                                    }
                                }
                            })
                        }
                    });
                    const batchDeleteLikesCommandResponse = await dynamoDBClient.send(batchDeleteLikesCommand);
                    if (batchDeleteLikesCommandResponse.$metadata.httpStatusCode !== 200) {
                        console.log("DDB batch write command failed for deleting all likes associated with canvas.");
                    }
                }

                // Remove new canvas record in CanvasesDigest table
                const queryNewCanvasRecordCommand = new QueryCommand({
                    TableName: CANVASES_DIGEST_TABLE_NAME,
                    IndexName: "canvasesDigestsByCanvasIdAndPartitionKey",
                    Limit: 1,
                    KeyConditionExpression: "canvasId = :canvasId AND partitionKey = :partitionKeyValue",
                    ExpressionAttributeValues: {
                        ":canvasId": { "S": canvasId },
                        ":partitionKeyValue": { "S": "canvases#new" }
                    },
                });
                const queryNewCanvasRecordCommandResponse = await dynamoDBClient.send(queryNewCanvasRecordCommand);
                if (queryNewCanvasRecordCommandResponse.$metadata.httpStatusCode !== 200 ||
                    !queryNewCanvasRecordCommandResponse.Items) {
                    console.log("DDB query command failed for retrieving digest canvas within canvases#new.");
                    return;
                }

                if (queryNewCanvasRecordCommandResponse.Items.length === 0) {
                    return;
                }
                const canvasToRemove = queryNewCanvasRecordCommandResponse.Items[0];
                if (!canvasToRemove.sortKey.N) {
                    console.log("No sortKey found for canvas to remove in Digest table.")
                }
                const deleteNewCanvasCommand = new DeleteItemCommand({
                    Key: {
                        partitionKey: { S: "canvases#new" },
                        sortKey: canvasToRemove.sortKey,
                    },
                    TableName: CANVASES_DIGEST_TABLE_NAME
                });
                const deleteNewCanvasCommandResponse = await dynamoDBClient.send(deleteNewCanvasCommand);
                if (deleteNewCanvasCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB delete command failed for deleting new record from Digest table.");
                    return;
                }

                const getCommand = new GetItemCommand({
                    Key: {
                        partitionKey: { S: "canvases#new#count" },
                        sortKey: { N: "0" }
                    },
                    TableName: CANVASES_DIGEST_TABLE_NAME
                });
                const getCommandResponse = await dynamoDBClient.send(getCommand);
                if (getCommandResponse.$metadata.httpStatusCode !== 200 || !getCommandResponse.Item) {
                    console.log("DDB get command failed for retrieving canvases#new#count.");
                    return;
                }

                if (!getCommandResponse.Item.count.N) {
                    "No item count associated with canvases#new#count in Digest table";
                }

                const newCountString = String(Number(getCommandResponse.Item.count.N) - 1);

                const updateCommand = new UpdateItemCommand({
                    Key: {
                        partitionKey: { S: "canvases#new#count" },
                        sortKey: { N: "0" },
                    },
                    UpdateExpression: "SET #count = :count",
                    ExpressionAttributeNames: {
                        "#count": "count",
                    },
                    ExpressionAttributeValues: {
                        ":count": { "N": newCountString },
                    },
                    TableName: CANVASES_DIGEST_TABLE_NAME
                });
                const updateCommandResponse = await dynamoDBClient.send(updateCommand);
                if (updateCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB update command failed for updating new canvases count.");
                    return;
                }
            }
        }
    } catch (error) {
        console.log("Unexpected server error occurred.");
        console.log(error);
        return;
    }
};