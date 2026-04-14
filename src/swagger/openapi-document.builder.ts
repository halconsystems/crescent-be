import { DocumentBuilder } from '@nestjs/swagger';

export const JWT_AUTH_BEARER = 'JWT-auth';

/**
 * Tag order in Swagger UI (unknown tags sort after these, alphabetically).
 * Keep in sync with `@ApiTags(...)` on controllers.
 */
export const SWAGGER_TAG_ORDER: readonly string[] = [
  'Auth',
  'Users',
  'Sales',
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

function buildDescription(): string {
  return [
    'REST API for onboarding, **RBAC**, **sales workflow**, and master data. All resource paths are under **`/api/v1/...`** unless noted.',
    '',
    '### Authentication',
    '- **Public:** `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`.',
    '- **JWT:** all other routes require `Authorization: Bearer <accessToken>`. Use **Authorize** in Swagger UI.',
    '',
    '### RBAC (fine-grained permissions)',
    '- Permission codes are defined in the codebase (`portal-permissions`) and stored in **`Permission`** / **`RolePermission`**.',
    '- Seed defaults: `npx prisma db seed` creates permissions and a **System Administrator** role with all of them.',
    '- Assign roles to users with **`User roles`**; grant permissions to roles with **`Role permissions`**.',
    '- **Sales** endpoints use `@RequirePermissions(...)`: missing permission returns **403**.',
    '',
    '### Sales workflow',
    '- `POST /api/v1/sales` — create sale, initial stage rows, and optional initial sales payload (single call).',
    '- `GET /api/v1/sales`, `GET /api/v1/sales/:id` — list / detail (needs `sales.view`).',
    '- `GET /api/v1/sales/:id/audit` — audit trail (`sales.audit.view`).',
    '- **Stage updates (PATCH):**',
    '  - `/api/v1/sales/:id/accounts-stage` — accounts review / decision.',
    '  - `/api/v1/sales/:id/operations-stage` — device, zone, technician, etc.',
    '  - `/api/v1/sales/:id/technician-stage` — installation fields.',
    '',
    '### Master / lookup data',
    'CRUD for offices, zones, products, banks, cities, vendors, employees, packages, **devices / SIMs / combos / accessories**, etc.',
    '',
    'Passwords and token hashes are never returned in responses.',
  ].join('\n');
}

export function buildOpenApiDocument() {
  const builder = new DocumentBuilder()
    .setTitle('Crescent API')
    .setDescription(buildDescription())
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste the **accessToken** from login or register. Prefix `Bearer ` if your client does not add it automatically.',
      },
      JWT_AUTH_BEARER,
    );

  const publicApiUrl = process.env.API_PUBLIC_URL?.trim();
  if (publicApiUrl) {
    builder.addServer(publicApiUrl.replace(/\/$/, ''), 'Configured API (API_PUBLIC_URL)');
  }
  builder.addServer('/', 'Current host (e.g. http://localhost:3000)');

  for (const tag of SWAGGER_TAG_ORDER) {
    const descriptions: Record<string, string> = {
      Auth: 'Login, register, refresh, logout — no JWT on these operations',
      Users: 'Application users (`AppUser`); JWT required',
      Sales: 'Sale lifecycle, stage progression, and audit — JWT + permission codes',
      Permissions: 'Permission catalog (`permissionCode` strings used by RBAC)',
      'Role permissions': 'Links roles to permissions',
      Roles: 'Named roles; combine with Role permissions for access control',
      'User roles': 'Assign roles to application users',
      Employees: 'HR records; optional `userId` links to `AppUser`',
      Devices: 'Operations catalog: physical device types',
      SIMs: 'Operations catalog: SIM / data products',
      'Device combos': 'Operations catalog: bundled device offerings',
      Accessories: 'Operations catalog: add-on accessories',
      Offices: 'Company offices',
      Zones: 'Zones under an office',
      'Zone employees': 'Which employees belong to which zone',
      Products: 'Sellable / service products',
      Packages: 'Pricing packages (decimal charges)',
      'Client categories': 'Client segmentation for sale client details',
      Banks: 'Bank master data',
      'Bank accounts': 'Bank account records',
      Cities: 'City master',
      Vendors: 'Vendor / supplier records',
    };
    builder.addTag(tag, descriptions[tag] ?? '');
  }

  return builder.build();
}
