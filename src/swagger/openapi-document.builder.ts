import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Name of the Bearer JWT scheme in OpenAPI; must match `@ApiBearerAuth(...)`.
 */
export const JWT_AUTH_BEARER = 'JWT-auth';

/**
 * Shared Swagger / OpenAPI document config for HTTP (`main.ts`) and serverless (`api/index.ts`).
 */
export function buildOpenApiDocument() {
  return new DocumentBuilder()
    .setTitle('Crescent API')
    .setDescription(
      'REST API for onboarding and reference data. Base path for resources is `/api/v1/...`. ' +
        '**Authentication:** call **Auth → login** to obtain a JWT, then click **Authorize** and enter `Bearer <token>` (or only the token, depending on the UI). ' +
        'All routes except `POST /api/v1/auth/login` require a valid JWT. ' +
        'Sensitive fields (passwords, token hashes) are never returned where noted in operation summaries.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT access token from `POST /api/v1/auth/login`. Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`',
      },
      JWT_AUTH_BEARER,
    )
    .addTag('Auth', 'Authentication — login is public; use returned token for other endpoints')
    .addTag('Clients', 'Legacy client records')
    .addTag('Offices')
    .addTag('Zones')
    .addTag('Products')
    .addTag('Banks')
    .addTag('Bank accounts')
    .addTag('Cities')
    .addTag('Vendors')
    .addTag('Roles')
    .addTag('Employees')
    .addTag('App users')
    .addTag('User roles')
    .addTag('Client categories')
    .addTag('Packages')
    .addTag('Zone employees')
    .build();
}
