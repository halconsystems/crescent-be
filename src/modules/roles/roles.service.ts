import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        roleName: dto.roleName,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.role.findMany({ orderBy: { roleId: 'asc' } });
  }

  async findOne(roleId: number) {
    const row = await this.prisma.role.findUnique({ where: { roleId } });
    if (!row) throw new NotFoundException(`Role ${roleId} not found`);
    return row;
  }

  async update(roleId: number, dto: UpdateRoleDto) {
    await this.findOne(roleId);
    return this.prisma.role.update({ where: { roleId }, data: dto });
  }

  async remove(roleId: number) {
    await this.findOne(roleId);
    return this.prisma.role.delete({ where: { roleId } });
  }
}
