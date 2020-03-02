import { APIGatewayEvent, Context, Handler, Callback } from "aws-lambda";

class Router {

  private readonly event: APIGatewayEvent;
  private readonly path: string;
  private readonly method: string;
  private readonly context: Context;
  private callback: Callback<any>;

  public body: string = '';

  constructor(event: APIGatewayEvent, context: Context, callback: Callback<any>) {
    this.event = event;
    this.path = event.resource;
    this.method = event.httpMethod;
    this.context = context;
    this.callback = callback;
  }

  public route(method: string, path: string, handler: Handler) {
    if (this.method === method && this.path === path) {
      try {
        if (method !== 'GET') {
          this.body = JSON.parse(this.body);
        }
        handler(this.event, this.context, this.callback);
      } catch (e) {
        console.log(e);
        this.callback(null, buildResponse(500, "Data Error"));
      }
    }
  }
}

function buildResponse(statusCode: number, body: any) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
}

export { Router, buildResponse };
