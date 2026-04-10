import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePermissionDefinitionDto } from './dto/create-permission-definition.dto';
import { UpdatePermissionDefinitionDto } from './dto/update-permission-definition.dto';

@Injectable()
export class PermissionDefinitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePermissionDefinitionDto) {
    const existing = await this.prisma.permission.findUnique({
      where: { permissionCode: dto.permissionCode },
    });
    if (existing) {
      throw new ConflictException(`Permission ${dto.permissionCode} already exists`);
    }
    return this.prisma.permission.create({
      data: {
        permissionCode: dto.permissionCode,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.permission.findMany({ orderBy: { permissionId: 'asc' } });
  }

  async findOne(permissionId: number) {
    const row = await this.prisma.permission.findUnique({ where: { permissionId } });
    if (!row) throw new NotFoundException(`Permission ${permissionId} not found`);
    return row;
  }

  async update(permissionId: number, dto: UpdatePermissionDefinitionDto) {
    await this.findOne(permissionId);
    if (dto.permissionCode != null) {
      const clash = await this.prisma.permission.findFirst({
        where: {
          permissionCode: dto.permissionCode,
          permissionId: { not: permissionId },
        },
      });
      if (clash) throw new ConflictException(`Permission code ${dto.permissionCode} already in use`);
    }
    return this.prisma.permission.update({ where: { permissionId }, data: dto });
  }

  async remove(permissionId: number) {
    await this.findOne(permissionId);
    return this.prisma.permission.delete({ where: { permissionId } });
  }
}
