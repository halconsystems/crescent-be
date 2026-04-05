import { DocumentBuilder } from '@nestjs/swagger';
export const JWT_AUTH_BEARER = 'JWT-auth';
export function buildOpenApiDocument() {
  return new DocumentBuilder()
    .setTitle('Crescent API')
    .setDescription(
      'REST API for onboarding and reference data. Base path for resources is `/api/v1/...`. ' +
        '**Authentication:** call **Auth → login** or **Auth → register** to obtain tokens, then click **Authorize** and enter `Bearer <token>` (or only the token, depending on the UI). ' +
        'Use **Auth → refresh** to rotate refresh tokens and issue new access tokens, and **Auth → logout** to revoke a refresh token. ' +
        'All routes except `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/refresh`, and `POST /api/v1/auth/logout` require a valid JWT. ' +
        'Sensitive fields (passwords, token hashes) are never returned where noted in operation summaries.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT access token from `POST /api/v1/auth/login` or `POST /api/v1/auth/register`. Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`',
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
    .addTag('User roles')
    .addTag('Client categories')
    .addTag('Packages')
    .addTag('Zone employees')
    .build();
}
