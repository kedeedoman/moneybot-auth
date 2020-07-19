import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './src/app.module';
import { Express } from 'express';
import { Server } from 'http';
import { Context } from 'aws-lambda';
import { createServer, proxy, Response } from 'aws-serverless-express';
import * as express from 'express';
import { authorizerHandler } from './auth.service';
import * as lambda from 'aws-lambda';

export async function createApp(
  expressApp: Express,
): Promise<INestApplication> {

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp));

  return app;

}

let cachedServer: Server;

async function bootstrap(): Promise<Server> {
  const expressApp = express();

  const app = await createApp(expressApp);
  await app.init();
  app.enableCors();

  return createServer(expressApp);
}


export async function handler(event: lambda.APIGatewayProxyEvent | Record<string, any>, context: Context): Promise<Response | Record<string, any>> {
  console.log("Hello World")
  if ("authorizationToken" in event) {
    return authorizerHandler(event)
  }
  else {
    if (!cachedServer) {
      cachedServer = await bootstrap();
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return proxy(cachedServer, event, context, 'PROMISE').promise;
  }
}
