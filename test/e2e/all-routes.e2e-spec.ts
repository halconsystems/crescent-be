import * as argon2 from 'argon2';
import request from 'supertest';
import { createTestApp, TestAppContext } from '../helpers/create-test-app';
import { seedHappyPathMocks } from '../helpers/prisma-mock';
import { patchBodies, postBodies } from '../fixtures/payloads';

type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

interface RouteCase {
  name: string;
  method: HttpMethod;
  path: string;
  body?: object;
  expected: number;
  /** default true */
  auth?: boolean;
}

const api = (path: string) => path;

const routes: RouteCase[] = [
  { name: 'sales list', method: 'get', path: api('/api/v1/sales'), expected: 200 },
  { name: 'sales create', method: 'post', path: api('/api/v1/sales'), expected: 201 },
  { name: 'sales get', method: 'get', path: api('/api/v1/sales/1'), expected: 200 },
  { name: 'sales audit', method: 'get', path: api('/api/v1/sales/1/audit'), expected: 200 },

  { name: 'inventory stores list', method: 'get', path: api('/api/v1/stores'), expected: 200 },
  {
    name: 'inventory store create',
    method: 'post',
    path: api('/api/v1/stores'),
    body: { storeName: 'Warehouse A' },
    expected: 201,
  },
  { name: 'inventory items list', method: 'get', path: api('/api/v1/items'), expected: 200 },
  {
    name: 'inventory item create',
    method: 'post',
    path: api('/api/v1/items'),
    body: { sku: 'SKU-1', itemName: 'Item 1' },
    expected: 201,
  },
  {
    name: 'inventory pr create',
    method: 'post',
    path: api('/api/v1/purchase-requests'),
    body: { storeId: 1, lines: [{ itemId: 1, qty: 1 }] },
    expected: 201,
  },
  { name: 'inventory pr approve', method: 'post', path: api('/api/v1/purchase-requests/1/approve'), expected: 201 },
  {
    name: 'inventory po create',
    method: 'post',
    path: api('/api/v1/purchase-orders'),
    body: { purchaseRequestId: 1, vendorId: 1, storeId: 1, lines: [{ itemId: 1, qty: 1 }] },
    expected: 201,
  },
  { name: 'inventory po approve', method: 'post', path: api('/api/v1/purchase-orders/1/approve'), expected: 201 },
  {
    name: 'inventory grn create',
    method: 'post',
    path: api('/api/v1/grn'),
    body: { purchaseOrderId: 1, storeId: 1, lines: [{ itemId: 1, qty: 1 }] },
    expected: 201,
  },
  { name: 'inventory grn confirm', method: 'post', path: api('/api/v1/grn/1/confirm'), expected: 201 },
  {
    name: 'inventory issuance create',
    method: 'post',
    path: api('/api/v1/issuance'),
    body: { storeId: 1, lines: [{ itemId: 1, qty: 1 }] },
    expected: 201,
  },
  {
    name: 'inventory return create',
    method: 'post',
    path: api('/api/v1/returns'),
    body: { storeId: 1, lines: [{ itemId: 1, qty: 1 }] },
    expected: 201,
  },
  {
    name: 'inventory transfer create',
    method: 'post',
    path: api('/api/v1/transfers'),
    body: { fromStoreId: 1, toStoreId: 2, lines: [{ itemId: 1, qty: 1 }] },
    expected: 201,
  },
  { name: 'inventory card', method: 'get', path: api('/api/v1/inventory-card?item_id=1&store_id=1'), expected: 200 },
  { name: 'inventory report stock', method: 'get', path: api('/api/v1/reports/stock'), expected: 200 },
  { name: 'inventory dashboard stats', method: 'get', path: api('/api/v1/dashboard/stats'), expected: 200 },

  { name: 'permissions list', method: 'get', path: api('/api/v1/permissions'), expected: 200 },
  { name: 'permissions create', method: 'post', path: api('/api/v1/permissions'), body: postBodies.permission, expected: 201 },
  { name: 'permissions get', method: 'get', path: api('/api/v1/permissions/1'), expected: 200 },
  { name: 'permissions patch', method: 'patch', path: api('/api/v1/permissions/1'), body: patchBodies.permission, expected: 200 },
  { name: 'permissions delete', method: 'delete', path: api('/api/v1/permissions/1'), expected: 200 },

  { name: 'role-permissions list', method: 'get', path: api('/api/v1/role-permissions'), expected: 200 },
  {
    name: 'role-permissions list filter',
    method: 'get',
    path: api('/api/v1/role-permissions?roleId=1&permissionId=1'),
    expected: 200,
  },
  {
    name: 'role-permissions create',
    method: 'post',
    path: api('/api/v1/role-permissions'),
    body: postBodies.rolePermission,
    expected: 201,
  },
  { name: 'role-permissions get', method: 'get', path: api('/api/v1/role-permissions/1'), expected: 200 },
  {
    name: 'role-permissions patch',
    method: 'patch',
    path: api('/api/v1/role-permissions/1'),
    body: patchBodies.rolePermission,
    expected: 200,
  },
  { name: 'role-permissions delete', method: 'delete', path: api('/api/v1/role-permissions/1'), expected: 200 },

  { name: 'devices list', method: 'get', path: api('/api/v1/devices'), expected: 200 },
  { name: 'devices create', method: 'post', path: api('/api/v1/devices'), body: postBodies.device, expected: 201 },
  { name: 'devices get', method: 'get', path: api('/api/v1/devices/1'), expected: 200 },
  { name: 'devices patch', method: 'patch', path: api('/api/v1/devices/1'), body: patchBodies.device, expected: 200 },
  { name: 'devices delete', method: 'delete', path: api('/api/v1/devices/1'), expected: 200 },

  { name: 'sims list', method: 'get', path: api('/api/v1/sims'), expected: 200 },
  { name: 'sims create', method: 'post', path: api('/api/v1/sims'), body: postBodies.sim, expected: 201 },
  { name: 'sims get', method: 'get', path: api('/api/v1/sims/1'), expected: 200 },
  { name: 'sims patch', method: 'patch', path: api('/api/v1/sims/1'), body: patchBodies.sim, expected: 200 },
  { name: 'sims delete', method: 'delete', path: api('/api/v1/sims/1'), expected: 200 },

  { name: 'device-combos list', method: 'get', path: api('/api/v1/device-combos'), expected: 200 },
  {
    name: 'device-combos create',
    method: 'post',
    path: api('/api/v1/device-combos'),
    body: postBodies.deviceCombo,
    expected: 201,
  },
  { name: 'device-combos get', method: 'get', path: api('/api/v1/device-combos/1'), expected: 200 },
  {
    name: 'device-combos patch',
    method: 'patch',
    path: api('/api/v1/device-combos/1'),
    body: patchBodies.deviceCombo,
    expected: 200,
  },
  { name: 'device-combos delete', method: 'delete', path: api('/api/v1/device-combos/1'), expected: 200 },

  { name: 'accessories list', method: 'get', path: api('/api/v1/accessories'), expected: 200 },
  {
    name: 'accessories create',
    method: 'post',
    path: api('/api/v1/accessories'),
    body: postBodies.accessory,
    expected: 201,
  },
  { name: 'accessories get', method: 'get', path: api('/api/v1/accessories/1'), expected: 200 },
  {
    name: 'accessories patch',
    method: 'patch',
    path: api('/api/v1/accessories/1'),
    body: patchBodies.accessory,
    expected: 200,
  },
  { name: 'accessories delete', method: 'delete', path: api('/api/v1/accessories/1'), expected: 200 },

  { name: 'offices list', method: 'get', path: api('/api/v1/offices'), expected: 200 },
  { name: 'offices create', method: 'post', path: api('/api/v1/offices'), body: postBodies.office, expected: 201 },
  { name: 'offices get', method: 'get', path: api('/api/v1/offices/1'), expected: 200 },
  { name: 'offices patch', method: 'patch', path: api('/api/v1/offices/1'), body: patchBodies.office, expected: 200 },
  { name: 'offices delete', method: 'delete', path: api('/api/v1/offices/1'), expected: 200 },

  { name: 'zones list', method: 'get', path: api('/api/v1/zones'), expected: 200 },
  { name: 'zones list filter', method: 'get', path: api('/api/v1/zones?officeId=1'), expected: 200 },
  { name: 'zones create', method: 'post', path: api('/api/v1/zones'), body: postBodies.zone, expected: 201 },
  { name: 'zones get', method: 'get', path: api('/api/v1/zones/1'), expected: 200 },
  { name: 'zones patch', method: 'patch', path: api('/api/v1/zones/1'), body: patchBodies.zone, expected: 200 },
  { name: 'zones delete', method: 'delete', path: api('/api/v1/zones/1'), expected: 200 },

  { name: 'products list', method: 'get', path: api('/api/v1/products'), expected: 200 },
  { name: 'products create', method: 'post', path: api('/api/v1/products'), body: postBodies.product, expected: 201 },
  { name: 'products get', method: 'get', path: api('/api/v1/products/1'), expected: 200 },
  { name: 'products patch', method: 'patch', path: api('/api/v1/products/1'), body: patchBodies.product, expected: 200 },
  { name: 'products delete', method: 'delete', path: api('/api/v1/products/1'), expected: 200 },

  { name: 'banks list', method: 'get', path: api('/api/v1/banks'), expected: 200 },
  { name: 'banks create', method: 'post', path: api('/api/v1/banks'), body: postBodies.bank, expected: 201 },
  { name: 'banks get', method: 'get', path: api('/api/v1/banks/1'), expected: 200 },
  { name: 'banks patch', method: 'patch', path: api('/api/v1/banks/1'), body: patchBodies.bank, expected: 200 },
  { name: 'banks delete', method: 'delete', path: api('/api/v1/banks/1'), expected: 200 },

  { name: 'bank-accounts list', method: 'get', path: api('/api/v1/bank-accounts'), expected: 200 },
  { name: 'bank-accounts list filter', method: 'get', path: api('/api/v1/bank-accounts?bankId=1'), expected: 200 },
  { name: 'bank-accounts create', method: 'post', path: api('/api/v1/bank-accounts'), body: postBodies.bankAccount, expected: 201 },
  { name: 'bank-accounts get', method: 'get', path: api('/api/v1/bank-accounts/1'), expected: 200 },
  { name: 'bank-accounts patch', method: 'patch', path: api('/api/v1/bank-accounts/1'), body: patchBodies.bankAccount, expected: 200 },
  { name: 'bank-accounts delete', method: 'delete', path: api('/api/v1/bank-accounts/1'), expected: 200 },

  { name: 'cities list', method: 'get', path: api('/api/v1/cities'), expected: 200 },
  { name: 'cities create', method: 'post', path: api('/api/v1/cities'), body: postBodies.city, expected: 201 },
  { name: 'cities get', method: 'get', path: api('/api/v1/cities/1'), expected: 200 },
  { name: 'cities patch', method: 'patch', path: api('/api/v1/cities/1'), body: patchBodies.city, expected: 200 },
  { name: 'cities delete', method: 'delete', path: api('/api/v1/cities/1'), expected: 200 },

  { name: 'vendors list', method: 'get', path: api('/api/v1/vendors'), expected: 200 },
  { name: 'vendors list filter', method: 'get', path: api('/api/v1/vendors?cityId=1'), expected: 200 },
  { name: 'vendors create', method: 'post', path: api('/api/v1/vendors'), body: postBodies.vendor, expected: 201 },
  { name: 'vendors get', method: 'get', path: api('/api/v1/vendors/1'), expected: 200 },
  { name: 'vendors patch', method: 'patch', path: api('/api/v1/vendors/1'), body: patchBodies.vendor, expected: 200 },
  { name: 'vendors delete', method: 'delete', path: api('/api/v1/vendors/1'), expected: 200 },

  { name: 'roles list', method: 'get', path: api('/api/v1/roles'), expected: 200 },
  { name: 'roles create', method: 'post', path: api('/api/v1/roles'), body: postBodies.role, expected: 201 },
  { name: 'roles get', method: 'get', path: api('/api/v1/roles/1'), expected: 200 },
  { name: 'roles patch', method: 'patch', path: api('/api/v1/roles/1'), body: patchBodies.role, expected: 200 },
  { name: 'roles delete', method: 'delete', path: api('/api/v1/roles/1'), expected: 200 },

  { name: 'employees list', method: 'get', path: api('/api/v1/employees'), expected: 200 },
  { name: 'employees create', method: 'post', path: api('/api/v1/employees'), body: postBodies.employee, expected: 201 },
  { name: 'employees get', method: 'get', path: api('/api/v1/employees/1'), expected: 200 },
  { name: 'employees patch', method: 'patch', path: api('/api/v1/employees/1'), body: patchBodies.employee, expected: 200 },
  { name: 'employees delete', method: 'delete', path: api('/api/v1/employees/1'), expected: 200 },

  { name: 'app-users list', method: 'get', path: api('/api/v1/app-users'), expected: 200 },
  { name: 'auth register', method: 'post', path: api('/api/v1/auth/register'), body: postBodies.appUser, expected: 201 },
  { name: 'app-users get', method: 'get', path: api('/api/v1/app-users/1'), expected: 200 },
  { name: 'app-users patch', method: 'patch', path: api('/api/v1/app-users/1'), body: patchBodies.appUser, expected: 200 },
  { name: 'app-users delete', method: 'delete', path: api('/api/v1/app-users/1'), expected: 200 },

  { name: 'user-roles list', method: 'get', path: api('/api/v1/user-roles'), expected: 200 },
  { name: 'user-roles list filter', method: 'get', path: api('/api/v1/user-roles?userId=1&roleId=1'), expected: 200 },
  { name: 'user-roles create', method: 'post', path: api('/api/v1/user-roles'), body: postBodies.userRole, expected: 201 },
  { name: 'user-roles get', method: 'get', path: api('/api/v1/user-roles/1'), expected: 200 },
  { name: 'user-roles patch', method: 'patch', path: api('/api/v1/user-roles/1'), body: patchBodies.userRole, expected: 200 },
  { name: 'user-roles delete', method: 'delete', path: api('/api/v1/user-roles/1'), expected: 200 },

  { name: 'client-categories list', method: 'get', path: api('/api/v1/client-categories'), expected: 200 },
  { name: 'client-categories create', method: 'post', path: api('/api/v1/client-categories'), body: postBodies.clientCategory, expected: 201 },
  { name: 'client-categories get', method: 'get', path: api('/api/v1/client-categories/1'), expected: 200 },
  { name: 'client-categories patch', method: 'patch', path: api('/api/v1/client-categories/1'), body: patchBodies.clientCategory, expected: 200 },
  { name: 'client-categories delete', method: 'delete', path: api('/api/v1/client-categories/1'), expected: 200 },

  { name: 'packages list', method: 'get', path: api('/api/v1/packages'), expected: 200 },
  { name: 'packages create', method: 'post', path: api('/api/v1/packages'), body: postBodies.package, expected: 201 },
  { name: 'packages get', method: 'get', path: api('/api/v1/packages/1'), expected: 200 },
  { name: 'packages patch', method: 'patch', path: api('/api/v1/packages/1'), body: patchBodies.package, expected: 200 },
  { name: 'packages delete', method: 'delete', path: api('/api/v1/packages/1'), expected: 200 },

  { name: 'zone-employees list', method: 'get', path: api('/api/v1/zone-employees'), expected: 200 },
  { name: 'zone-employees list filter', method: 'get', path: api('/api/v1/zone-employees?zoneId=1&employeeId=1'), expected: 200 },
  { name: 'zone-employees create', method: 'post', path: api('/api/v1/zone-employees'), body: postBodies.zoneEmployee, expected: 201 },
  { name: 'zone-employees get', method: 'get', path: api('/api/v1/zone-employees/1'), expected: 200 },
  { name: 'zone-employees patch', method: 'patch', path: api('/api/v1/zone-employees/1'), body: { zoneId: 1 }, expected: 200 },
  { name: 'zone-employees delete', method: 'delete', path: api('/api/v1/zone-employees/1'), expected: 200 },
];

const protectedSamples = [
  ['GET', '/api/v1/offices'],
  ['POST', '/api/v1/offices'],
  ['GET', '/api/v1/zones'],
  ['GET', '/api/v1/sales'],
  ['GET', '/api/v1/products/1'],
];

function dispatch(
  server: Parameters<typeof request>[0],
  method: HttpMethod,
  path: string,
  headers: Record<string, string>,
  body?: object,
) {
  const agent = request(server);
  let req: request.Test;
  switch (method) {
    case 'get':
      req = agent.get(path);
      break;
    case 'post':
      req = agent.post(path);
      break;
    case 'patch':
      req = agent.patch(path);
      break;
    case 'delete':
      req = agent.delete(path);
      break;
    default:
      throw new Error(`Unsupported method ${method}`);
  }
  req.set(headers);
  if (body !== undefined) {
    req.send(body);
  }
  return req;
}

describe('HTTP API (e2e)', () => {
  let ctx: TestAppContext;
  let authHeader: Record<string, string>;

  beforeAll(async () => {
    ctx = await createTestApp();
    const token = await ctx.jwtService.signAsync({ sub: 1, email: 'tester@example.com' });
    authHeader = { Authorization: `Bearer ${token}` };
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  beforeEach(() => {
    seedHappyPathMocks(ctx.prismaMock);
  });

  describe('JWT — unauthorized', () => {
    it.each(protectedSamples)('%s %s returns 401 without token', async (method, path) => {
      await dispatch(
        ctx.app.getHttpServer(),
        method.toLowerCase() as HttpMethod,
        path,
        {},
      ).expect(401);
    });
  });

  describe('JWT — authorized routes', () => {
    it.each(routes)('$name', async (route: RouteCase) => {
      const { method, path, body, expected } = route;
      await dispatch(ctx.app.getHttpServer(), method, path, authHeader, body).expect(expected);
    });
  });

  describe('Auth — login', () => {
    it('returns access token for valid credentials', async () => {
      const hash = await argon2.hash('Password1!');
      (ctx.prismaMock.appUser.findUnique as jest.Mock).mockResolvedValue({
        userId: 1,
        email: 'loginuser@example.com',
        passwordHash: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(ctx.app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'loginuser@example.com', password: 'Password1!' })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.passwordHash).toBeUndefined();
    });
  });
});
