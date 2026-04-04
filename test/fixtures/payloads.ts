import { DesignationType } from '@prisma/client';

/** ISO date strictly after `new Date()` when tests run */
export const futureIso = '2099-12-31T23:59:59.000Z';

export const postBodies = {
  office: { officeName: 'HQ' },
  zone: { officeId: 1, zoneName: 'North' },
  product: { productName: 'Internet' },
  bank: { bankName: 'Test Bank' },
  bankAccount: { bankId: 1, accountNo: '000111' },
  city: { cityName: 'Karachi' },
  vendor: { vendorName: 'ACME' },
  role: { roleName: 'Admin' },
  employee: { cnic: '35202-1111111-1', designation: DesignationType.Staff },
  appUser: { userName: 'route-test-user', password: 'Password1!' },
  userRole: { userId: 1, roleId: 1 },
  passwordResetToken: {
    userId: 1,
    token: 'plain-reset-token',
    expiresAt: futureIso,
  },
  userPasswordHistory: { userId: 1, password: 'Password1!' },
  userSession: {
    userId: 1,
    refreshToken: 'plain-refresh-token',
    expiresAt: futureIso,
  },
  clientCategory: { categoryName: 'Residential' },
  package: {
    packageName: 'Basic',
    minCharges: 100,
    minRenewalCharges: 50,
  },
  zoneEmployee: { zoneId: 1, employeeId: 1 },
  client: {
    name: 'John',
    email: 'john@example.com',
    cnic: '35202-2222222-2',
    irNo: 'IR-1',
    phone: '+923001234567',
  },
} as const;

export const patchBodies = {
  office: { officeName: 'HQ Updated' },
  zone: { zoneName: 'South' },
  product: { productName: 'Fiber' },
  bank: { bankName: 'Renamed' },
  bankAccount: { accountNo: '999' },
  city: { cityName: 'Lahore' },
  vendor: { vendorName: 'Updated Vendor' },
  role: { roleName: 'Operator' },
  employee: { nextOfKin: 'Jane' },
  appUser: { isLocked: false },
  userRole: { roleId: 1 },
  passwordResetToken: { isActive: false },
  userSession: { isActive: true },
  clientCategory: { categoryName: 'Commercial' },
  package: { minCharges: 200 },
  zoneEmployee: {},
} as const;
