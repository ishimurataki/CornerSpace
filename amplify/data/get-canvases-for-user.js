export function request(ctx) {
  return {
    operation: 'Query',
    query: {
      expression: '#owner = :user',
      expressionNames: { '#owner': 'owner' },
      expressionValues: util.dynamodb.toMapValues({ ':user': ctx.args.user }),
    }
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.items;
}