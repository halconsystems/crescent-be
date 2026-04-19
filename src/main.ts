import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { buildOpenApiDocument } from './swagger/openapi-document.builder';

/**
 * Tag order for Swagger UI `tagsSorter`. Must be self-contained (no imports): Nest inlines this
 * function into swagger-ui-init.js; closures over modules become invalid in the browser.
 * Keep in sync with `openapi-document.builder.ts` → SWAGGER_TAG_ORDER.
 */
function swaggerUiTagsSorter(a: unknown, b: unknown): number {
  const ORDER = [
    'Auth',
    'Users',
    'Sales',
    'Inventory setup',
    'Inventory items',
    'Inventory purchase requests',
    'Inventory purchase orders',
    'Inventory grn',
    'Inventory movements',
    'Inventory reports',
    'Inventory utility',
    'Inventory dashboard',
    'Permissions',
    'Role permissions',
    'Roles',
    'User roles',
    'Employees',
    'Devices',
    'SIMs',
    'Device combos',
    'Accessories',
    'Offices',
    'Zones',
    'Zone employees',
    'Products',
    'Packages',
    'Client categories',
    'Banks',
    'Bank accounts',
    'Cities',
    'Vendors',
  ];
  const nameA = typeof a === 'string' ? a : (a && typeof a === 'object' && 'name' in a && typeof (a as { name: unknown }).name === 'string' ? (a as { name: string }).name : '');
  const nameB = typeof b === 'string' ? b : (b && typeof b === 'object' && 'name' in b && typeof (b as { name: unknown }).name === 'string' ? (b as { name: string }).name : '');
  const ia = ORDER.indexOf(nameA);
  const ib = ORDER.indexOf(nameB);
  if (ia === -1 && ib === -1) return nameA.localeCompare(nameB);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';
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

  if (!isProduction) {
    const expressApp = app.getHttpAdapter().getInstance() as {
      use: (fn: (req: { path?: string }, res: { setHeader: (n: string, v: string) => void }, next: () => void) => void) => void;
    };
    expressApp.use((req, res, next) => {
      const p = req.path ?? '';
      if (p === '/api' || p.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      next();
    });
  }

  const document = SwaggerModule.createDocument(app, buildOpenApiDocument());
  SwaggerModule.setup('api', app, document, {
    ...(isProduction
      ? {}
      : {
          patchDocumentOnRequest: (
            _req: unknown,
            _res: unknown,
            _cached: OpenAPIObject,
          ): OpenAPIObject => SwaggerModule.createDocument(app, buildOpenApiDocument()),
        }),
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: swaggerUiTagsSorter,
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
