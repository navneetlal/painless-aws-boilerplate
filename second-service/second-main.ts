import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

import * as lambdaRouter from '../utils/lambda-router';
import * as second_functions from './second-function';

export function handler(event: APIGatewayEvent, context: Context, callback: Callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const router = new lambdaRouter.Router(event, context, callback);

  router.route(
    'GET',
    '/actions',
    (event: APIGatewayEvent, context: Context, callback: Callback) => {
      second_functions.function_name(event.queryStringParameters).then((data: any) => {
        callback(null, lambdaRouter.buildResponse(200, {
          ...data,
          success: true
        }))
      }).catch((e: Error) => {
        console.error(e)
        callback(null, lambdaRouter.buildResponse(500, {
          records: "ERROR",
          success: false
        }))
      });

    }
  );
};
