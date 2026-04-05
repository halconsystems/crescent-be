import { Prisma } from '@prisma/client';
import { DesignationType } from '@prisma/client';
import type { PrismaService } from '../../src/database/prisma.service';

type Delegate = {
  findMany: jest.Mock;
  findFirst: jest.Mock;
  findUnique: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

function del(): Delegate {
  return {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

const now = () => new Date();

/** Builds a mocked PrismaClient-shaped object injected as `PrismaService`. */
export function createPrismaServiceMock(): PrismaService {
  const mock = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
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
    clientCategory: del(),
    package: del(),
    zone: del(),
    zoneEmployee: del(),
    client: del(),
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
    employeeId: null as number | null,
    userName: 'tester',
    passwordHash: 'argon2-hash',
    isTempPassword: true,
    mustChangePassword: true,
    isEmailVerified: false,
    isMobileVerified: false,
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    lastLoginAt: null as Date | null,
    lastPasswordChangedAt: null as Date | null,
    createdAt: now(),
    updatedAt: now(),
    createdByUserId: null as number | null,
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
    where: { userId?: number; userName?: string; employeeId?: number };
  }) => {
    if (args.where.userId != null) return baseAppUser(args.where.userId);
    if (args.where.userName != null) return { ...baseAppUser(1), userName: args.where.userName };
    if (args.where.employeeId != null) return null;
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

  const userRole = (id: number) => ({
    userRoleId: id,
    userId: 1,
    roleId: 1,
    assignedAt: now(),
    assignedByUserId: null as number | null,
    createdAt: now(),
    updatedAt: now(),
  });
  m.userRole.findMany.mockResolvedValue([]);
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
  });
  m.zone.findMany.mockResolvedValue([]);
  m.zone.findUnique.mockImplementation(async (args: { where: { zoneId: number } }) => zone(args.where.zoneId));
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

  m.client.findMany.mockResolvedValue([]);
  m.client.findUnique.mockImplementation(async (args: { where: { id: number } }) => ({
    id: args.where.id,
    name: 'C',
    email: 'e@e.com',
    cnic: 'x',
    irNo: 'ir',
    phone: 'p',
  }));
  m.client.create.mockImplementation(async (args: { data: object }) => ({
    id: 1,
    name: 'C',
    email: 'e@e.com',
    cnic: 'x',
    irNo: 'ir',
    phone: 'p',
    ...args.data,
  }));
  m.client.update.mockImplementation(async (args: { where: { id: number }; data: object }) => ({
    id: args.where.id,
    name: 'C',
    email: 'e@e.com',
    cnic: 'x',
    irNo: 'ir',
    phone: 'p',
    ...args.data,
  }));
  m.client.delete.mockImplementation(async (args: { where: { id: number } }) => ({
    id: args.where.id,
    name: 'C',
    email: 'e@e.com',
    cnic: 'x',
    irNo: 'ir',
    phone: 'p',
  }));
  m.client.findFirst.mockResolvedValue(null);
}
