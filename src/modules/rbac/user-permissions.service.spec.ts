import { Test } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { UserPermissionsService } from './user-permissions.service';

describe('UserPermissionsService', () => {
  it('aggregates permission codes from active roles', async () => {
    const prisma = {
      userRole: {
        findMany: jest.fn().mockResolvedValue([
          {
            role: {
              isActive: true,
              rolePermissions: [
                {
                  permission: { permissionCode: 'sales.view', isActive: true },
                },
                {
                  permission: { permissionCode: 'sales.create', isActive: false },
                },
              ],
            },
          },
          {
            role: {
              isActive: false,
              rolePermissions: [
                { permission: { permissionCode: 'ignored', isActive: true } },
              ],
            },
          },
        ]),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPermissionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    const service = moduleRef.get(UserPermissionsService);
    const codes = await service.getPermissionCodesForUser(1);
    expect(codes.has('sales.view')).toBe(true);
    expect(codes.has('sales.create')).toBe(false);
    expect(codes.has('ignored')).toBe(false);
  });
});
