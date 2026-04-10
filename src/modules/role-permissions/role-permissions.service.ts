import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRolePermissionDto) {
    const role = await this.prisma.role.findUnique({ where: { roleId: dto.roleId } });
    if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);
    const perm = await this.prisma.permission.findUnique({ where: { permissionId: dto.permissionId } });
    if (!perm) throw new NotFoundException(`Permission ${dto.permissionId} not found`);
    const existing = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: { roleId: dto.roleId, permissionId: dto.permissionId },
      },
    });
    if (existing) {
      throw new ConflictException(`Role ${dto.roleId} already has permission ${dto.permissionId}`);
    }
    return this.prisma.rolePermission.create({
      data: { roleId: dto.roleId, permissionId: dto.permissionId },
    });
  }

  findAll(roleId?: number, permissionId?: number) {
    return this.prisma.rolePermission.findMany({
      where: {
        ...(roleId != null ? { roleId } : {}),
        ...(permissionId != null ? { permissionId } : {}),
      },
      orderBy: { rolePermissionId: 'asc' },
    });
  }

  async findOne(rolePermissionId: number) {
    const row = await this.prisma.rolePermission.findUnique({ where: { rolePermissionId } });
    if (!row) throw new NotFoundException(`Role permission ${rolePermissionId} not found`);
    return row;
  }

  async update(rolePermissionId: number, dto: UpdateRolePermissionDto) {
    await this.findOne(rolePermissionId);
    if (dto.roleId != null) {
      const r = await this.prisma.role.findUnique({ where: { roleId: dto.roleId } });
      if (!r) throw new NotFoundException(`Role ${dto.roleId} not found`);
    }
    if (dto.permissionId != null) {
      const p = await this.prisma.permission.findUnique({ where: { permissionId: dto.permissionId } });
      if (!p) throw new NotFoundException(`Permission ${dto.permissionId} not found`);
    }
    return this.prisma.rolePermission.update({
      where: { rolePermissionId },
      data: dto,
    });
  }

  async remove(rolePermissionId: number) {
    await this.findOne(rolePermissionId);
    return this.prisma.rolePermission.delete({ where: { rolePermissionId } });
  }
}
