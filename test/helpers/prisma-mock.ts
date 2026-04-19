import { Prisma } from '@prisma/client';
import { DesignationType } from '@prisma/client';
import type { PrismaService } from '../../src/database/prisma.service';
import { PORTAL_PERMISSION_CODES } from '../../src/common/rbac/portal-permissions';

type Delegate = {
  findMany: jest.Mock;
  findFirst: jest.Mock;
  findUnique: jest.Mock;
  findUniqueOrThrow: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  updateMany: jest.Mock;
  delete: jest.Mock;
  upsert: jest.Mock;
};

function del(): Delegate {
  const findUnique = jest.fn();
  return {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique,
    findUniqueOrThrow: jest.fn(async (args: unknown) => {
      const row = await findUnique(args);
      if (row == null) {
        throw new Error('Record not found');
      }
      return row;
    }),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  };
}

const now = () => new Date();

/** Builds a mocked PrismaClient-shaped object injected as `PrismaService`. */
export function createPrismaServiceMock(): PrismaService {
  const mock = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $transaction: jest.fn(),
    office: del(),
    product: del(),
    bank: del(),
    bankAccount: del(),
    city: del(),
    vendor: del(),
    role: del(),
    employee: del(),
    appUser: del(),
    userRole: del(),
    refreshToken: del(),
    clientCategory: del(),
    package: del(),
    zone: del(),
    zoneEmployee: del(),
    permission: del(),
    rolePermission: del(),
    device: del(),
    sim: del(),
    deviceCombo: del(),
    accessory: del(),
    sale: del(),
    saleClientDetails: del(),
    saleProductDetails: del(),
    saleAccountsReview: del(),
    saleOperationsAssignment: del(),
    saleInstallation: del(),
    saleStageStatus: del(),
    saleAuditLog: del(),
    invStore: del(),
    invCategory: del(),
    invGroup: del(),
    invVendor: del(),
    invItem: del(),
    invPurchaseRequest: del(),
    invPurchaseRequestLine: del(),
    invPurchaseOrder: del(),
    invPurchaseOrderLine: del(),
    invGrn: del(),
    invGrnLine: del(),
    invIssuance: del(),
    invIssuanceLine: del(),
    invReturn: del(),
    invReturnLine: del(),
    invTransfer: del(),
    invTransferLine: del(),
    invStockLedger: del(),
  };
  return mock as unknown as PrismaService;
}

function baseOffice(id: number) {
  return {
    officeId: id,
    officeName: 'Test Office',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  };
}

function baseAppUser(id: number) {
  return {
    userId: id,
    email: 'tester@example.com',
    passwordHash: 'argon2-hash',
    dob: new Date('1990-01-01T00:00:00.000Z'),
    cnic: '35202-3333333-3',
    contactNo: '+923001234567',
    address: 'Street 1, City',
    createdAt: now(),
    updatedAt: now(),
  };
}

function baseRefreshToken(id: number) {
  return {
    refreshTokenId: id,
    userId: 1,
    tokenHash: 'hash',
    issuedAt: now(),
    expiresAt: new Date('2099-12-31T23:59:59.000Z'),
    revokedAt: null as Date | null,
    revokedReason: null as string | null,
    replacedByTokenId: null as number | null,
    userAgent: null as string | null,
    ipv4: null as string | null,
    ipv6: null as string | null,
  };
}

/** Default happy-path behavior for all HTTP handlers (no real DB). */
export function seedHappyPathMocks(prisma: ReturnType<typeof createPrismaServiceMock>) {
  // Cast: runtime object is jest mocks, not real PrismaClient methods.
  const m = prisma as any;
  m.$connect.mockResolvedValue(undefined);
  m.$disconnect.mockResolvedValue(undefined);

  m.office.findMany.mockResolvedValue([]);
  m.office.findUnique.mockImplementation(async (args: { where: { officeId: number } }) =>
    baseOffice(args.where.officeId),
  );
  m.office.create.mockImplementation(async (args: { data: Record<string, unknown> }) => ({
    ...baseOffice(1),
    ...args.data,
    officeId: 1,
  }));
  m.office.update.mockImplementation(async (args: { where: { officeId: number }; data: object }) => ({
    ...baseOffice(args.where.officeId),
    ...args.data,
  }));
  m.office.delete.mockImplementation(async (args: { where: { officeId: number } }) =>
    baseOffice(args.where.officeId),
  );
  m.office.findFirst.mockResolvedValue(null);

  const product = (id: number) => ({
    productId: id,
    productName: 'P',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.product.findMany.mockResolvedValue([]);
  m.product.findUnique.mockImplementation(async (args: { where: { productId: number } }) =>
    product(args.where.productId),
  );
  m.product.create.mockImplementation(async (args: { data: object }) => ({ ...product(1), ...args.data }));
  m.product.update.mockImplementation(async (args: { where: { productId: number }; data: object }) => ({
    ...product(args.where.productId),
    ...args.data,
  }));
  m.product.delete.mockImplementation(async (args: { where: { productId: number } }) =>
    product(args.where.productId),
  );
  m.product.findFirst.mockResolvedValue(null);

  const bank = (id: number) => ({
    bankId: id,
    bankName: 'Bank',
    bankCode: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.bank.findMany.mockResolvedValue([]);
  m.bank.findUnique.mockImplementation(async (args: { where: { bankId: number } }) =>
    bank(args.where.bankId),
  );
  m.bank.create.mockImplementation(async (args: { data: object }) => ({ ...bank(1), ...args.data }));
  m.bank.update.mockImplementation(async (args: { where: { bankId: number }; data: object }) => ({
    ...bank(args.where.bankId),
    ...args.data,
  }));
  m.bank.delete.mockImplementation(async (args: { where: { bankId: number } }) => bank(args.where.bankId));
  m.bank.findFirst.mockResolvedValue(null);

  const bankAccount = (id: number) => ({
    bankAccountId: id,
    bankId: 1,
    accountNo: 'acc',
    iban: null as string | null,
    branchCode: null as string | null,
    branch: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.bankAccount.findMany.mockResolvedValue([]);
  m.bankAccount.findUnique.mockImplementation(
    async (args: { where: { bankAccountId: number } }) => bankAccount(args.where.bankAccountId),
  );
  m.bankAccount.create.mockImplementation(async (args: { data: object }) => ({
    ...bankAccount(1),
    ...args.data,
  }));
  m.bankAccount.update.mockImplementation(async (args: { where: { bankAccountId: number }; data: object }) => ({
    ...bankAccount(args.where.bankAccountId),
    ...args.data,
  }));
  m.bankAccount.delete.mockImplementation(async (args: { where: { bankAccountId: number } }) =>
    bankAccount(args.where.bankAccountId),
  );
  m.bankAccount.findFirst.mockResolvedValue(null);

  const city = (id: number) => ({
    cityId: id,
    cityName: 'City',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.city.findMany.mockResolvedValue([]);
  m.city.findUnique.mockImplementation(async (args: { where: { cityId: number } }) => city(args.where.cityId));
  m.city.create.mockImplementation(async (args: { data: object }) => ({ ...city(1), ...args.data }));
  m.city.update.mockImplementation(async (args: { where: { cityId: number }; data: object }) => ({
    ...city(args.where.cityId),
    ...args.data,
  }));
  m.city.delete.mockImplementation(async (args: { where: { cityId: number } }) => city(args.where.cityId));
  m.city.findFirst.mockResolvedValue(null);

  const vendor = (id: number) => ({
    vendorId: id,
    vendorName: 'V',
    cityId: null as number | null,
    address: null as string | null,
    emailId: null as string | null,
    contactPerson: null as string | null,
    primaryMobile: null as string | null,
    secondaryMobile: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.vendor.findMany.mockResolvedValue([]);
  m.vendor.findUnique.mockImplementation(async (args: { where: { vendorId: number } }) =>
    vendor(args.where.vendorId),
  );
  m.vendor.create.mockImplementation(async (args: { data: object }) => ({ ...vendor(1), ...args.data }));
  m.vendor.update.mockImplementation(async (args: { where: { vendorId: number }; data: object }) => ({
    ...vendor(args.where.vendorId),
    ...args.data,
  }));
  m.vendor.delete.mockImplementation(async (args: { where: { vendorId: number } }) =>
    vendor(args.where.vendorId),
  );
  m.vendor.findFirst.mockResolvedValue(null);

  const role = (id: number) => ({
    roleId: id,
    roleName: 'Role',
    description: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.role.findMany.mockResolvedValue([]);
  m.role.findUnique.mockImplementation(async (args: { where: { roleId: number } }) => role(args.where.roleId));
  m.role.create.mockImplementation(async (args: { data: object }) => ({ ...role(1), ...args.data }));
  m.role.update.mockImplementation(async (args: { where: { roleId: number }; data: object }) => ({
    ...role(args.where.roleId),
    ...args.data,
  }));
  m.role.delete.mockImplementation(async (args: { where: { roleId: number } }) => role(args.where.roleId));
  m.role.findFirst.mockResolvedValue(null);

  const employee = (id: number) => ({
    employeeId: id,
    userId: null as number | null,
    emailId: null as string | null,
    primaryMobileNo: null as string | null,
    cnic: '35202-0000000-0',
    designation: DesignationType.Staff,
    nextOfKin: null as string | null,
    nextOfKinContact: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.employee.findMany.mockResolvedValue([]);
  m.employee.findUnique.mockImplementation(async (args: { where: { employeeId: number } }) =>
    employee(args.where.employeeId),
  );
  m.employee.create.mockImplementation(async (args: { data: object }) => ({ ...employee(1), ...args.data }));
  m.employee.update.mockImplementation(async (args: { where: { employeeId: number }; data: object }) => ({
    ...employee(args.where.employeeId),
    ...args.data,
  }));
  m.employee.delete.mockImplementation(async (args: { where: { employeeId: number } }) =>
    employee(args.where.employeeId),
  );
  m.employee.findFirst.mockResolvedValue(null);

  m.appUser.findMany.mockResolvedValue([baseAppUser(1)]);
  m.appUser.findUnique.mockImplementation(async (args: {
    where: { userId?: number; email?: string };
  }) => {
    if (args.where.userId != null) return baseAppUser(args.where.userId);
    if (args.where.email != null) return { ...baseAppUser(1), email: args.where.email };
    return baseAppUser(1);
  });
  m.appUser.create.mockImplementation(async (args: { data: object }) => ({
    ...baseAppUser(1),
    ...args.data,
  }));
  m.appUser.update.mockImplementation(async (args: { where: { userId: number }; data: object }) => ({
    ...baseAppUser(args.where.userId),
    ...args.data,
  }));
  m.appUser.delete.mockImplementation(async (args: { where: { userId: number } }) => baseAppUser(args.where.userId));
  m.appUser.findFirst.mockResolvedValue(null);

  m.refreshToken.findUnique.mockImplementation(async (args: {
    where: { refreshTokenId?: number; tokenHash?: string };
  }) => {
    if (args.where.refreshTokenId != null) return baseRefreshToken(args.where.refreshTokenId);
    if (args.where.tokenHash != null) {
      return { ...baseRefreshToken(1), tokenHash: args.where.tokenHash };
    }
    return null;
  });
  m.refreshToken.create.mockImplementation(async (args: { data: object }) => ({
    ...baseRefreshToken(1),
    ...args.data,
    refreshTokenId: 1,
  }));
  m.refreshToken.update.mockImplementation(
    async (args: { where: { refreshTokenId: number }; data: object }) => ({
      ...baseRefreshToken(args.where.refreshTokenId),
      ...args.data,
    }),
  );
  m.refreshToken.delete.mockImplementation(async (args: { where: { refreshTokenId: number } }) =>
    baseRefreshToken(args.where.refreshTokenId),
  );
  m.refreshToken.findMany.mockResolvedValue([]);
  m.refreshToken.findFirst.mockResolvedValue(null);

  const userRole = (id: number) => ({
    userRoleId: id,
    userId: 1,
    roleId: 1,
    assignedAt: now(),
    assignedByUserId: null as number | null,
    createdAt: now(),
    updatedAt: now(),
  });
  m.userRole.findMany.mockImplementation(async (args: { include?: unknown }) => {
    const inc = args?.include as { role?: { include?: { rolePermissions?: unknown } } } | undefined;
    if (inc?.role?.include?.rolePermissions != null) {
      return [
        {
          userRoleId: 1,
          userId: 1,
          roleId: 1,
          assignedAt: now(),
          assignedByUserId: null as number | null,
          createdAt: now(),
          updatedAt: now(),
          role: {
            roleId: 1,
            roleName: 'E2E',
            description: null as string | null,
            isActive: true,
            createdAt: now(),
            updatedAt: now(),
            rolePermissions: PORTAL_PERMISSION_CODES.map((permissionCode, i) => ({
              rolePermissionId: i + 1,
              roleId: 1,
              permissionId: i + 1,
              createdAt: now(),
              updatedAt: now(),
              permission: {
                permissionId: i + 1,
                permissionCode,
                description: null as string | null,
                isActive: true,
                createdAt: now(),
                updatedAt: now(),
              },
            })),
          },
        },
      ];
    }
    return [];
  });
  m.userRole.findUnique.mockImplementation(async (args: { where: { userRoleId: number } }) =>
    userRole(args.where.userRoleId),
  );
  m.userRole.findFirst.mockResolvedValue(null);
  m.userRole.create.mockImplementation(async (args: { data: object }) => ({ ...userRole(1), ...args.data }));
  m.userRole.update.mockImplementation(async (args: { where: { userRoleId: number }; data: object }) => ({
    ...userRole(args.where.userRoleId),
    ...args.data,
  }));
  m.userRole.delete.mockImplementation(async (args: { where: { userRoleId: number } }) =>
    userRole(args.where.userRoleId),
  );

  const cat = (id: number) => ({
    categoryId: id,
    categoryName: 'Cat',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.clientCategory.findMany.mockResolvedValue([]);
  m.clientCategory.findUnique.mockImplementation(async (args: { where: { categoryId: number } }) =>
    cat(args.where.categoryId),
  );
  m.clientCategory.create.mockImplementation(async (args: { data: object }) => ({ ...cat(1), ...args.data }));
  m.clientCategory.update.mockImplementation(async (args: { where: { categoryId: number }; data: object }) => ({
    ...cat(args.where.categoryId),
    ...args.data,
  }));
  m.clientCategory.delete.mockImplementation(async (args: { where: { categoryId: number } }) =>
    cat(args.where.categoryId),
  );
  m.clientCategory.findFirst.mockResolvedValue(null);

  const pkg = (id: number) => ({
    packageId: id,
    packageName: 'Pkg',
    minCharges: new Prisma.Decimal(0),
    minRenewalCharges: new Prisma.Decimal(0),
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.package.findMany.mockResolvedValue([]);
  m.package.findUnique.mockImplementation(async (args: { where: { packageId: number } }) => pkg(args.where.packageId));
  m.package.create.mockImplementation(async (args: { data: object }) => ({ ...pkg(1), ...args.data }));
  m.package.update.mockImplementation(async (args: { where: { packageId: number }; data: object }) => ({
    ...pkg(args.where.packageId),
    ...args.data,
  }));
  m.package.delete.mockImplementation(async (args: { where: { packageId: number } }) => pkg(args.where.packageId));
  m.package.findFirst.mockResolvedValue(null);

  const zone = (id: number) => ({
    zoneId: id,
    officeId: 1,
    zoneName: 'Z',
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
    zoneEmployees: [] as Array<unknown>,
  });
  m.zone.findMany.mockResolvedValue([]);
  m.zone.findUnique.mockImplementation(async (args: { where: { zoneId: number } }) => ({
    ...zone(args.where.zoneId),
    _count: { zoneEmployees: 0, saleOperationsAssignments: 0 },
  }));
  m.zone.create.mockImplementation(async (args: { data: object }) => ({ ...zone(1), ...args.data }));
  m.zone.update.mockImplementation(async (args: { where: { zoneId: number }; data: object }) => ({
    ...zone(args.where.zoneId),
    ...args.data,
  }));
  m.zone.delete.mockImplementation(async (args: { where: { zoneId: number } }) => zone(args.where.zoneId));
  m.zone.findFirst.mockResolvedValue(null);

  const ze = (id: number) => ({
    zoneEmployeeId: id,
    zoneId: 1,
    employeeId: 1,
    createdAt: now(),
    updatedAt: now(),
  });
  m.zoneEmployee.findMany.mockResolvedValue([]);
  m.zoneEmployee.findUnique.mockImplementation(async (args: { where: { zoneEmployeeId: number } }) =>
    ze(args.where.zoneEmployeeId),
  );
  m.zoneEmployee.findFirst.mockResolvedValue(null);
  m.zoneEmployee.create.mockImplementation(async (args: { data: object }) => ({ ...ze(1), ...args.data }));
  m.zoneEmployee.update.mockImplementation(async (args: { where: { zoneEmployeeId: number }; data: object }) => ({
    ...ze(args.where.zoneEmployeeId),
    ...args.data,
  }));
  m.zoneEmployee.delete.mockImplementation(async (args: { where: { zoneEmployeeId: number } }) =>
    ze(args.where.zoneEmployeeId),
  );

  m.$transaction.mockImplementation(async (fn: (client: typeof m) => Promise<unknown>) => fn(m));

  const saleStages = (saleId: number, userId: number) => [
    {
      saleStageStatusId: 1,
      saleId,
      stageCode: 'SALES' as const,
      status: 'IN_PROGRESS' as const,
      updatedByUserId: userId,
      updatedAt: now(),
    },
    {
      saleStageStatusId: 2,
      saleId,
      stageCode: 'ACCOUNTS' as const,
      status: 'PENDING' as const,
      updatedByUserId: null as number | null,
      updatedAt: now(),
    },
    {
      saleStageStatusId: 3,
      saleId,
      stageCode: 'OPERATIONS' as const,
      status: 'PENDING' as const,
      updatedByUserId: null as number | null,
      updatedAt: now(),
    },
    {
      saleStageStatusId: 4,
      saleId,
      stageCode: 'TECHNICIAN' as const,
      status: 'PENDING' as const,
      updatedByUserId: null as number | null,
      updatedAt: now(),
    },
  ];

  const saleFull = (id: number) => ({
    saleId: id,
    saleCode: `SAL-MOCK-${id}`,
    createdByUserId: 1,
    createdAt: now(),
    updatedAt: now(),
    isActive: true,
    clientDetails: null,
    productDetails: null,
    accountsReview: null,
    operationsAssignment: null,
    installation: null,
    stageStatuses: saleStages(id, 1),
  });

  m.sale.findMany.mockImplementation(async () => [saleFull(1)]);
  m.sale.findUnique.mockImplementation(async (args: { where: { saleId: number } }) =>
    saleFull(args.where.saleId),
  );
  m.sale.create.mockImplementation(
    async (args: {
      data: {
        saleCode: string;
        createdByUserId: number;
        stageStatuses?: { create: Array<{ stageCode: string; status: string; updatedByUserId: number }> };
      };
    }) => {
      const { saleCode, createdByUserId, stageStatuses } = args.data;
      const sid = 1;
      return {
        ...saleFull(sid),
        saleCode,
        createdByUserId,
        stageStatuses:
          stageStatuses?.create?.map((s, i) => ({
            saleStageStatusId: i + 1,
            saleId: sid,
            stageCode: s.stageCode,
            status: s.status,
            updatedByUserId: s.updatedByUserId,
            updatedAt: now(),
          })) ?? saleStages(sid, createdByUserId),
      };
    },
  );
  m.sale.update.mockImplementation(async (args: { where: { saleId: number }; data: object }) => ({
    ...saleFull(args.where.saleId),
    ...args.data,
  }));

  m.saleAuditLog.findMany.mockResolvedValue([]);

  const catalog = (prefix: string, idField: string, nameField: string) => {
    const row = (id: number) => ({
      [idField]: id,
      [nameField]: `${prefix}-${id}`,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    });
    return { row };
  };

  const permRow = catalog('perm', 'permissionId', 'permissionCode');
  m.permission.findMany.mockResolvedValue([]);
  m.permission.findUnique.mockImplementation(
    async (args: { where: { permissionId?: number; permissionCode?: string } }) => {
      if (args.where.permissionId != null) {
        return permRow.row(args.where.permissionId);
      }
      if (args.where.permissionCode != null) {
        return null;
      }
      return null;
    },
  );
  m.permission.create.mockImplementation(async (args: { data: object }) => ({
    permissionId: 1,
    permissionCode: 'x',
    description: null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
    ...args.data,
  }));
  m.permission.update.mockImplementation(async (args: { where: { permissionId: number }; data: object }) => ({
    ...permRow.row(args.where.permissionId),
    ...args.data,
  }));
  m.permission.delete.mockImplementation(async (args: { where: { permissionId: number } }) =>
    permRow.row(args.where.permissionId),
  );
  m.permission.findFirst.mockResolvedValue(null);

  m.rolePermission.findMany.mockResolvedValue([]);
  m.rolePermission.findUnique.mockImplementation(
    async (args: {
      where:
        | { rolePermissionId: number }
        | { roleId_permissionId: { roleId: number; permissionId: number } };
    }) => {
      if ('rolePermissionId' in args.where) {
        return {
          rolePermissionId: args.where.rolePermissionId,
          roleId: 1,
          permissionId: 1,
          createdAt: now(),
          updatedAt: now(),
        };
      }
      return null;
    },
  );
  m.rolePermission.create.mockImplementation(async (args: { data: object }) => ({
    rolePermissionId: 1,
    roleId: 1,
    permissionId: 1,
    createdAt: now(),
    updatedAt: now(),
    ...args.data,
  }));
  m.rolePermission.update.mockImplementation(
    async (args: { where: { rolePermissionId: number }; data: object }) => ({
      rolePermissionId: args.where.rolePermissionId,
      roleId: 1,
      permissionId: 1,
      createdAt: now(),
      updatedAt: now(),
      ...args.data,
    }),
  );
  m.rolePermission.delete.mockImplementation(async (args: { where: { rolePermissionId: number } }) => ({
    rolePermissionId: args.where.rolePermissionId,
    roleId: 1,
    permissionId: 1,
    createdAt: now(),
    updatedAt: now(),
  }));
  m.rolePermission.findFirst.mockResolvedValue(null);

  const dev = catalog('dev', 'deviceId', 'deviceName');
  m.device.findMany.mockResolvedValue([]);
  m.device.findUnique.mockImplementation(async (args: { where: { deviceId: number } }) =>
    dev.row(args.where.deviceId),
  );
  m.device.create.mockImplementation(async (args: { data: object }) => ({ ...dev.row(1), ...args.data }));
  m.device.update.mockImplementation(async (args: { where: { deviceId: number }; data: object }) => ({
    ...dev.row(args.where.deviceId),
    ...args.data,
  }));
  m.device.delete.mockImplementation(async (args: { where: { deviceId: number } }) => dev.row(args.where.deviceId));
  m.device.findFirst.mockResolvedValue(null);

  const simR = catalog('sim', 'simId', 'simName');
  m.sim.findMany.mockResolvedValue([]);
  m.sim.findUnique.mockImplementation(async (args: { where: { simId: number } }) => simR.row(args.where.simId));
  m.sim.create.mockImplementation(async (args: { data: object }) => ({ ...simR.row(1), ...args.data }));
  m.sim.update.mockImplementation(async (args: { where: { simId: number }; data: object }) => ({
    ...simR.row(args.where.simId),
    ...args.data,
  }));
  m.sim.delete.mockImplementation(async (args: { where: { simId: number } }) => simR.row(args.where.simId));
  m.sim.findFirst.mockResolvedValue(null);

  const combo = catalog('combo', 'deviceComboId', 'comboName');
  m.deviceCombo.findMany.mockResolvedValue([]);
  m.deviceCombo.findUnique.mockImplementation(
    async (args: { where: { deviceComboId: number } }) => combo.row(args.where.deviceComboId),
  );
  m.deviceCombo.create.mockImplementation(async (args: { data: object }) => ({ ...combo.row(1), ...args.data }));
  m.deviceCombo.update.mockImplementation(
    async (args: { where: { deviceComboId: number }; data: object }) => ({
      ...combo.row(args.where.deviceComboId),
      ...args.data,
    }),
  );
  m.deviceCombo.delete.mockImplementation(
    async (args: { where: { deviceComboId: number } }) => combo.row(args.where.deviceComboId),
  );
  m.deviceCombo.findFirst.mockResolvedValue(null);

  const acc = catalog('acc', 'accessoryId', 'accessoryName');
  m.accessory.findMany.mockResolvedValue([]);
  m.accessory.findUnique.mockImplementation(
    async (args: { where: { accessoryId: number } }) => acc.row(args.where.accessoryId),
  );
  m.accessory.create.mockImplementation(async (args: { data: object }) => ({ ...acc.row(1), ...args.data }));
  m.accessory.update.mockImplementation(async (args: { where: { accessoryId: number }; data: object }) => ({
    ...acc.row(args.where.accessoryId),
    ...args.data,
  }));
  m.accessory.delete.mockImplementation(
    async (args: { where: { accessoryId: number } }) => acc.row(args.where.accessoryId),
  );
  m.accessory.findFirst.mockResolvedValue(null);

  const invStore = (id: number) => ({
    storeId: id,
    storeName: `Store ${id}`,
    location: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.invStore.findMany.mockResolvedValue([invStore(1)]);
  m.invStore.findUnique.mockImplementation(async (args: { where: { storeId: number } }) => invStore(args.where.storeId));
  m.invStore.create.mockImplementation(async (args: { data: object }) => ({ ...invStore(1), ...args.data }));
  m.invStore.update.mockImplementation(async (args: { where: { storeId: number }; data: object }) => ({
    ...invStore(args.where.storeId),
    ...args.data,
  }));
  m.invStore.delete.mockImplementation(async (args: { where: { storeId: number } }) => invStore(args.where.storeId));

  const invCategory = (id: number) => ({
    categoryId: id,
    categoryName: `Category ${id}`,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.invCategory.findMany.mockResolvedValue([invCategory(1)]);
  m.invCategory.findUnique.mockImplementation(async (args: { where: { categoryId: number } }) => invCategory(args.where.categoryId));
  m.invCategory.create.mockImplementation(async (args: { data: object }) => ({ ...invCategory(1), ...args.data }));
  m.invCategory.update.mockImplementation(async (args: { where: { categoryId: number }; data: object }) => ({
    ...invCategory(args.where.categoryId),
    ...args.data,
  }));
  m.invCategory.delete.mockImplementation(async (args: { where: { categoryId: number } }) => invCategory(args.where.categoryId));

  const invGroup = (id: number) => ({
    groupId: id,
    groupName: `Group ${id}`,
    description: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.invGroup.findMany.mockResolvedValue([invGroup(1)]);
  m.invGroup.findUnique.mockImplementation(async (args: { where: { groupId: number } }) => invGroup(args.where.groupId));
  m.invGroup.create.mockImplementation(async (args: { data: object }) => ({ ...invGroup(1), ...args.data }));
  m.invGroup.update.mockImplementation(async (args: { where: { groupId: number }; data: object }) => ({
    ...invGroup(args.where.groupId),
    ...args.data,
  }));
  m.invGroup.delete.mockImplementation(async (args: { where: { groupId: number } }) => invGroup(args.where.groupId));

  const invVendor = (id: number) => ({
    vendorId: id,
    vendorName: `Inventory Vendor ${id}`,
    contactPerson: null as string | null,
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.invVendor.findMany.mockResolvedValue([invVendor(1)]);
  m.invVendor.findUnique.mockImplementation(async (args: { where: { vendorId: number } }) => invVendor(args.where.vendorId));
  m.invVendor.create.mockImplementation(async (args: { data: object }) => ({ ...invVendor(1), ...args.data }));
  m.invVendor.update.mockImplementation(async (args: { where: { vendorId: number }; data: object }) => ({
    ...invVendor(args.where.vendorId),
    ...args.data,
  }));
  m.invVendor.delete.mockImplementation(async (args: { where: { vendorId: number } }) => invVendor(args.where.vendorId));

  const invItem = (id: number) => ({
    itemId: id,
    sku: `SKU-${id}`,
    itemName: `Item ${id}`,
    categoryId: 1,
    groupId: 1,
    defaultStoreId: 1,
    uom: 'pcs',
    reorderLevel: 1,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  });
  m.invItem.findMany.mockResolvedValue([invItem(1)]);
  m.invItem.findUnique.mockImplementation(async (args: { where: { itemId?: number; sku?: string } }) =>
    invItem(args.where.itemId ?? 1),
  );
  m.invItem.create.mockImplementation(async (args: { data: object }) => ({ ...invItem(1), ...args.data }));
  m.invItem.update.mockImplementation(async (args: { where: { itemId: number }; data: object }) => ({
    ...invItem(args.where.itemId),
    ...args.data,
  }));
  m.invItem.delete.mockImplementation(async (args: { where: { itemId: number } }) => invItem(args.where.itemId));
  m.invItem.count = jest.fn().mockResolvedValue(1);
  m.invStore.count = jest.fn().mockResolvedValue(1);

  const line = { itemId: 1, qty: 1, qtyReceived: 1 };
  m.invPurchaseRequest.findMany.mockResolvedValue([]);
  m.invPurchaseRequest.findUnique.mockResolvedValue({
    purchaseRequestId: 1,
    requestNo: 'PR-000001',
    status: 'APPROVED',
    storeId: 1,
    remarks: null,
    requestedByUserId: 1,
    approvedByUserId: 1,
    approvedAt: now(),
    rejectedByUserId: null,
    rejectedAt: null,
    rejectionReason: null,
    createdAt: now(),
    updatedAt: now(),
    lines: [{ purchaseRequestLineId: 1, purchaseRequestId: 1, ...line, note: null, createdAt: now(), updatedAt: now() }],
    store: invStore(1),
  });
  m.invPurchaseRequest.create.mockResolvedValue({ purchaseRequestId: 1, requestNo: 'PR-000001', lines: [] });
  m.invPurchaseRequest.update.mockResolvedValue({ purchaseRequestId: 1, requestNo: 'PR-000001', lines: [] });
  m.invPurchaseRequest.delete.mockResolvedValue({ purchaseRequestId: 1 });
  m.invPurchaseRequest.count = jest.fn().mockResolvedValue(1);
  m.invPurchaseRequestLine.deleteMany = jest.fn().mockResolvedValue({ count: 0 });
  m.invPurchaseRequestLine.createMany = jest.fn().mockResolvedValue({ count: 1 });

  m.invPurchaseOrder.findMany.mockResolvedValue([]);
  m.invPurchaseOrder.findUnique.mockResolvedValue({
    purchaseOrderId: 1,
    poNo: 'PO-000001',
    status: 'APPROVED',
    storeId: 1,
    vendorId: 1,
    purchaseRequestId: 1,
    remarks: null,
    orderedByUserId: 1,
    approvedByUserId: 1,
    approvedAt: now(),
    rejectedByUserId: null,
    rejectedAt: null,
    rejectionReason: null,
    createdAt: now(),
    updatedAt: now(),
    lines: [{ purchaseOrderLineId: 1, purchaseOrderId: 1, ...line, note: null, createdAt: now(), updatedAt: now() }],
    store: invStore(1),
    vendor: invVendor(1),
    purchaseRequest: null,
  });
  m.invPurchaseOrder.create.mockResolvedValue({ purchaseOrderId: 1, poNo: 'PO-000001', lines: [] });
  m.invPurchaseOrder.update.mockResolvedValue({ purchaseOrderId: 1, poNo: 'PO-000001', lines: [] });
  m.invPurchaseOrder.delete.mockResolvedValue({ purchaseOrderId: 1 });
  m.invPurchaseOrder.count = jest.fn().mockResolvedValue(1);
  m.invPurchaseOrderLine.deleteMany = jest.fn().mockResolvedValue({ count: 0 });
  m.invPurchaseOrderLine.createMany = jest.fn().mockResolvedValue({ count: 1 });

  m.invGrn.findMany.mockResolvedValue([]);
  m.invGrn.findUnique.mockResolvedValue({
    grnId: 1,
    grnNo: 'GRN-000001',
    status: 'DRAFT',
    storeId: 1,
    purchaseOrderId: 1,
    receivedByUserId: 1,
    confirmedByUserId: null,
    confirmedAt: null,
    remarks: null,
    createdAt: now(),
    updatedAt: now(),
    lines: [{ grnLineId: 1, grnId: 1, itemId: 1, qtyReceived: 1, note: null, createdAt: now(), updatedAt: now() }],
    store: invStore(1),
    purchaseOrder: null,
  });
  m.invGrn.create.mockResolvedValue({ grnId: 1, grnNo: 'GRN-000001', lines: [] });
  m.invGrn.update.mockResolvedValue({ grnId: 1, grnNo: 'GRN-000001', lines: [] });
  m.invGrn.delete.mockResolvedValue({ grnId: 1 });
  m.invGrn.count = jest.fn().mockResolvedValue(1);
  m.invGrnLine.deleteMany = jest.fn().mockResolvedValue({ count: 0 });
  m.invGrnLine.createMany = jest.fn().mockResolvedValue({ count: 1 });

  m.invIssuance.findMany.mockResolvedValue([]);
  m.invIssuance.findUnique.mockResolvedValue({
    issuanceId: 1,
    issuanceNo: 'ISS-000001',
    storeId: 1,
    issuedTo: null,
    remarks: null,
    issuedByUserId: 1,
    createdAt: now(),
    updatedAt: now(),
    lines: [],
    store: invStore(1),
  });
  m.invIssuance.create.mockResolvedValue({ issuanceId: 1, issuanceNo: 'ISS-000001', lines: [] });
  m.invIssuance.update.mockResolvedValue({ issuanceId: 1, issuanceNo: 'ISS-000001', lines: [] });
  m.invIssuance.delete.mockResolvedValue({ issuanceId: 1 });
  m.invIssuance.count = jest.fn().mockResolvedValue(1);

  m.invReturn.findMany.mockResolvedValue([]);
  m.invReturn.findUnique.mockResolvedValue({
    returnId: 1,
    returnNo: 'RET-000001',
    storeId: 1,
    sourceReference: null,
    remarks: null,
    returnedByUserId: 1,
    createdAt: now(),
    updatedAt: now(),
    lines: [],
    store: invStore(1),
  });
  m.invReturn.create.mockResolvedValue({ returnId: 1, returnNo: 'RET-000001', lines: [] });
  m.invReturn.update.mockResolvedValue({ returnId: 1, returnNo: 'RET-000001', lines: [] });
  m.invReturn.delete.mockResolvedValue({ returnId: 1 });
  m.invReturn.count = jest.fn().mockResolvedValue(1);

  m.invTransfer.findMany.mockResolvedValue([]);
  m.invTransfer.findUnique.mockResolvedValue({
    transferId: 1,
    transferNo: 'TRF-000001',
    fromStoreId: 1,
    toStoreId: 2,
    remarks: null,
    transferredByUserId: 1,
    createdAt: now(),
    updatedAt: now(),
    lines: [],
    fromStore: invStore(1),
    toStore: invStore(2),
  });
  m.invTransfer.create.mockResolvedValue({ transferId: 1, transferNo: 'TRF-000001', lines: [] });
  m.invTransfer.update.mockResolvedValue({ transferId: 1, transferNo: 'TRF-000001', lines: [] });
  m.invTransfer.delete.mockResolvedValue({ transferId: 1 });
  m.invTransfer.count = jest.fn().mockResolvedValue(1);

  m.invStockLedger.findMany.mockResolvedValue([]);
  m.invStockLedger.aggregate = jest.fn().mockResolvedValue({ _sum: { qtyIn: 100, qtyOut: 10 } });
  m.invStockLedger.createMany = jest.fn().mockResolvedValue({ count: 1 });
}
