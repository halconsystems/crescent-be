import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserRoleDto) {
    const user = await this.prisma.appUser.findUnique({ where: { userId: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
    const role = await this.prisma.role.findUnique({ where: { roleId: dto.roleId } });
    if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);
    if (dto.assignedByUserId != null) {
      const u = await this.prisma.appUser.findUnique({ where: { userId: dto.assignedByUserId } });
      if (!u) throw new NotFoundException(`User ${dto.assignedByUserId} not found`);
    }
    const existing = await this.prisma.userRole.findFirst({
      where: { userId: dto.userId, roleId: dto.roleId },
    });
    if (existing) {
      throw new ConflictException(`User ${dto.userId} already has role ${dto.roleId}`);
    }
    return this.prisma.userRole.create({
      data: {
        userId: dto.userId,
        roleId: dto.roleId,
        assignedByUserId: dto.assignedByUserId,
      },
    });
  }

  findAll(userId?: number, roleId?: number) {
    return this.prisma.userRole.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(roleId ? { roleId } : {}),
      },
      orderBy: { userRoleId: 'asc' },
    });
  }

  async findOne(userRoleId: number) {
    const row = await this.prisma.userRole.findUnique({ where: { userRoleId } });
    if (!row) throw new NotFoundException(`User role ${userRoleId} not found`);
    return row;
  }

  async update(userRoleId: number, dto: UpdateUserRoleDto) {
    await this.findOne(userRoleId);
    if (dto.roleId != null) {
      const r = await this.prisma.role.findUnique({ where: { roleId: dto.roleId } });
      if (!r) throw new NotFoundException(`Role ${dto.roleId} not found`);
    }
    if (dto.assignedByUserId != null) {
      const u = await this.prisma.appUser.findUnique({ where: { userId: dto.assignedByUserId } });
      if (!u) throw new NotFoundException(`User ${dto.assignedByUserId} not found`);
    }
    return this.prisma.userRole.update({
      where: { userRoleId },
      data: dto,
    });
  }

  async remove(userRoleId: number) {
    await this.findOne(userRoleId);
    return this.prisma.userRole.delete({ where: { userRoleId } });
  }
}
