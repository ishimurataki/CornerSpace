import type { DynamoDBStreamHandler } from 'aws-lambda';
import {
    DeleteItemCommand, DynamoDBClient,
    GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand
} from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient({});

const CANVASES_TABLE_NAME = "Canvases-ddw7ohyprze6vjdo4ccnqmqobi-NONE";
const CANVASES_DIGEST_TABLE_NAME = "CanvasesDigest-ddw7ohyprze6vjdo4ccnqmqobi-NONE";
const CANVAS_SOCIAL_STATS_TABLE_NAME = "CanvasSocialStats-ddw7ohyprze6vjdo4ccnqmqobi-NONE";
const MAX_POPULAR_CANVASES_IN_DIGEST_TABLE = 100;

export const handler: DynamoDBStreamHandler = async (event) => {

    try {
        for (const record of event.Records) {

            const currentTimeISO = new Date(Date.now()).toISOString();

            if ((record.eventName === "INSERT" && record.dynamodb?.NewImage) ||
                (record.eventName === "REMOVE" && record.dynamodb?.OldImage)) {
                console.log(`DDB Streams handler triggered for CanvaseLikes table: ${record.eventName} event.`);

                let canvasId = record.dynamodb.NewImage?.canvasId.S;
                let username = record.dynamodb.NewImage?.username.S;
                if (record.eventName === "REMOVE") {
                    canvasId = record.dynamodb.OldImage?.canvasId.S;
                    username = record.dynamodb.OldImage?.username.S;
                }
                if (!canvasId || !username) {
                    console.log("CanvasId or username missing from record.");
                    return;
                }

                // Get publicity
                const queryCanvasCommand = new QueryCommand({
                    TableName: CANVASES_TABLE_NAME,
                    IndexName: "canvasesByCanvasId",
                    Limit: 1,
                    KeyConditionExpression: "canvasId = :canvasId",
                    ExpressionAttributeValues: {
                        ":canvasId": { "S": canvasId }
                    },
                });
                const queryCanvasCommandResponse = await dynamoDBClient.send(queryCanvasCommand);
                if (queryCanvasCommandResponse.$metadata.httpStatusCode !== 200 ||
                    !queryCanvasCommandResponse.Items || queryCanvasCommandResponse.Items.length < 1) {
                    console.log("DDB query command failed for retrieving canvas metadata.");
                    return;
                }
                if (!queryCanvasCommandResponse.Items[0].publicity.S) {
                    console.log("Publicity attribute not found on canvas metadata.");
                    return;
                }
                if (queryCanvasCommandResponse.Items[0].publicity.S !== "PUBLIC") {
                    console.log("Publicity of canvas is not PUBLIC.");
                    return;
                }

                // Get current like count
                const queryCanvasSocialStatsCommand = new QueryCommand({
                    TableName: CANVAS_SOCIAL_STATS_TABLE_NAME,
                    IndexName: "canvasSocialStatsByCanvasId",
                    Limit: 1,
                    KeyConditionExpression: "canvasId = :canvasId",
                    ExpressionAttributeValues: {
                        ":canvasId": { "S": canvasId }
                    },
                });
                const queryCanvasSocialStatsCommandResponse = await dynamoDBClient.send(queryCanvasSocialStatsCommand);
                if (queryCanvasSocialStatsCommandResponse.$metadata.httpStatusCode !== 200 ||
                    !queryCanvasSocialStatsCommandResponse.Items || queryCanvasSocialStatsCommandResponse.Items.length < 1) {
                    console.log("DDB query command failed for retrieving canvas social stats.");
                    return;
                }
                if (!queryCanvasSocialStatsCommandResponse.Items[0].likeCount.N) {
                    console.log("LikeCount attribute not found on social stats record.")
                }
                const canvasLikeCount = Number(queryCanvasSocialStatsCommandResponse.Items[0].likeCount.N);
                const decimal = (Date.now() / 100000) % 1;
                const newSortKey = canvasLikeCount + decimal;

                // Check if popular canvas already exists in CanvasesDigest table
                const queryPopularCanvasCommand = new QueryCommand({
                    TableName: CANVASES_DIGEST_TABLE_NAME,
                    IndexName: "canvasesDigestsByCanvasIdAndPartitionKey",
                    Limit: 1,
                    KeyConditionExpression: "canvasId = :canvasId AND partitionKey = :partitionKeyValue",
                    ExpressionAttributeValues: {
                        ":canvasId": { "S": canvasId },
                        ":partitionKeyValue": { "S": "canvases#popular" }
                    },
                });
                const queryPopularCanvasCommandResponse = await dynamoDBClient.send(queryPopularCanvasCommand);
                if (queryPopularCanvasCommandResponse.$metadata.httpStatusCode !== 200 || !queryPopularCanvasCommandResponse.Items) {
                    console.log("DDB query command failed for retrieving popular canvas.");
                    return;
                }
                if (queryPopularCanvasCommandResponse.Items.length > 0) {
                    const popularCanvas = queryPopularCanvasCommandResponse.Items[0];
                    if (!popularCanvas.sortKey.N) {
                        console.log("SortKey not found for existing popular canvas in Digest table.");
                        return;
                    }
                    const deletePopularCanvasCommand = new DeleteItemCommand({
                        Key: {
                            partitionKey: { S: "canvases#popular" },
                            sortKey: popularCanvas.sortKey,
                        },
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });
                    const deletePopularCanvasCommandResponse = await dynamoDBClient.send(deletePopularCanvasCommand);
                    if (deletePopularCanvasCommandResponse.$metadata.httpStatusCode !== 200) {
                        console.log("DDB delete command failed for existing popular canvas record.");
                        return;
                    }
                    const createPopularCanvasCommand = new PutItemCommand({
                        Item: {
                            partitionKey: { S: "canvases#popular" },
                            sortKey: { N: String(newSortKey) },
                            canvasId: { S: canvasId },
                            __typename: { S: "CanvasesDigest" },
                            createdAt: { S: currentTimeISO },
                            updatedAt: { S: currentTimeISO }
                        },
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });
                    const createPopularCanvasCommandResponse = await dynamoDBClient.send(createPopularCanvasCommand);
                    if (createPopularCanvasCommandResponse.$metadata.httpStatusCode !== 200) {
                        console.log("DDB get create failed for initializing canvases#popular#count.");
                        return;
                    }
                    return;
                }

                // Append popular canvas record in CanvasesDigest table
                let popularCanvasesRecordCountInDigestTable = 0;
                const getPopularCountCommand = new GetItemCommand({
                    Key: {
                        partitionKey: { S: "canvases#popular#count" },
                        sortKey: { N: "0" }
                    },
                    TableName: CANVASES_DIGEST_TABLE_NAME
                });
                const getPopularCountCommandResponse = await dynamoDBClient.send(getPopularCountCommand);
                if (getPopularCountCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB get command failed for retrieving canvases#popular#count.");
                    return;
                }
                if (!getPopularCountCommandResponse.Item) {
                    const createCommand = new PutItemCommand({
                        Item: {
                            partitionKey: { S: "canvases#popular#count" },
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
                        console.log("DDB get create failed for initializing canvases#popular#count.");
                        return;
                    }
                } else if (getPopularCountCommandResponse.Item.count.N) {
                    popularCanvasesRecordCountInDigestTable = Number(getPopularCountCommandResponse.Item.count.N);
                }
                console.log("Numer of popular canvases in digest table is: " + String(popularCanvasesRecordCountInDigestTable));

                if (popularCanvasesRecordCountInDigestTable < MAX_POPULAR_CANVASES_IN_DIGEST_TABLE) {
                    const newCountString = String(popularCanvasesRecordCountInDigestTable + 1);
                    const updateCommand = new UpdateItemCommand({
                        Key: {
                            partitionKey: { S: "canvases#popular#count" },
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
                        console.log("DDB update command failed for updating popular canvases count.");
                        return;
                    }
                } else {
                    const queryCommand = new QueryCommand({
                        ExpressionAttributeValues: {
                            ":partitionKeyValue": { "S": "canvases#popular" },
                        },
                        KeyConditionExpression: "partitionKey = :partitionKeyValue",
                        Limit: 1,
                        ScanIndexForward: true,
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });

                    const queryCommandResponse = await dynamoDBClient.send(queryCommand);
                    if (queryCommandResponse.$metadata.httpStatusCode !== 200
                        || !queryCommandResponse.Items || queryCommandResponse.Items.length < 1) {
                        console.log("DDB query command failed for retrieving least liked popular record.");
                        return;
                    }

                    const canvasToEvictCandidateSortKey = queryCommandResponse.Items[0].sortKey.N;
                    if (!canvasToEvictCandidateSortKey) {
                        console.log("Sort key missing for least liked popular canvas record.");
                        return;
                    }

                    if (Number(canvasToEvictCandidateSortKey) >= newSortKey) {
                        console.log("Canvas popularity is not high enough to achieve top digest.")
                    }

                    const deleteCommand = new DeleteItemCommand({
                        Key: {
                            partitionKey: { S: "canvases#popular" },
                            sortKey: { N: canvasToEvictCandidateSortKey },
                        },
                        TableName: CANVASES_DIGEST_TABLE_NAME
                    });
                    const deleteCommandResponse = await dynamoDBClient.send(deleteCommand);
                    if (deleteCommandResponse.$metadata.httpStatusCode !== 200) {
                        console.log("DDB delete command failed for least liked popular canvas record.");
                        return;
                    }
                }

                const putCommand = new PutItemCommand({
                    Item: {
                        partitionKey: { S: "canvases#popular" },
                        sortKey: { N: String(newSortKey) },
                        canvasId: { S: canvasId },
                        __typename: { S: "CanvasesDigest" },
                        createdAt: { S: currentTimeISO },
                        updatedAt: { S: currentTimeISO }
                    },
                    TableName: CANVASES_DIGEST_TABLE_NAME
                });
                const putCommandResponse = await dynamoDBClient.send(putCommand);
                if (putCommandResponse.$metadata.httpStatusCode !== 200) {
                    console.log("DDB put command failed for creating popular canvas record.");
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