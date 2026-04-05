import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { buildOpenApiDocument } from '../src/swagger/openapi-document.builder';
import { join } from 'path';
import express from 'express';

let cachedApp: any;

async function bootstrapServer() {
  if (!cachedApp) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    const corsOrigins = (process.env.CORS_ORIGIN ?? process.env.FRONTEND_URL ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    app.enableCors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`), false);
      },
      credentials: true,
    });
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
    cachedApp = expressApp;
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrapServer();
  return app(req, res);
}
