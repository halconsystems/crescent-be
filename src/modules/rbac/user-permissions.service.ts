import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UserPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Resolves active permission codes for a user via UserRole → Role → RolePermission → Permission. */
  async getPermissionCodesForUser(userId: number): Promise<Set<string>> {
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    const codes = new Set<string>();
    for (const ur of rows) {
      if (!ur.role.isActive) continue;
      for (const rp of ur.role.rolePermissions) {
        if (rp.permission.isActive) {
          codes.add(rp.permission.permissionCode);
        }
      }
    }
    return codes;
  }
}
