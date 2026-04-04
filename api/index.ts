import { createServer, proxy } from 'aws-serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { buildOpenApiDocument } from '../src/swagger/openapi-document.builder';
import { join } from 'path';
import express from 'express';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    const swaggerDocument = SwaggerModule.createDocument(app, buildOpenApiDocument());

    expressApp.get(['/', '/swagger'], (_req, res) => {
      res.sendFile(join(process.cwd(), 'api', 'swagger-index.html'));
    });
    expressApp.get('/api-json', (_req, res) => {
      res.json(swaggerDocument);
    });
    await app.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const server = await bootstrapServer();
  return proxy(server, event, context, 'PROMISE').promise;
};
