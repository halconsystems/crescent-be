import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Injectable()
export class AccessoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAccessoryDto) {
    return this.prisma.accessory.create({
      data: {
        accessoryName: dto.accessoryName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.accessory.findMany({ orderBy: { accessoryId: 'asc' } });
  }

  async findOne(accessoryId: number) {
    const row = await this.prisma.accessory.findUnique({ where: { accessoryId } });
    if (!row) throw new NotFoundException(`Accessory ${accessoryId} not found`);
    return row;
  }

  async update(accessoryId: number, dto: UpdateAccessoryDto) {
    await this.findOne(accessoryId);
    return this.prisma.accessory.update({ where: { accessoryId }, data: dto });
  }

  async remove(accessoryId: number) {
    await this.findOne(accessoryId);
    return this.prisma.accessory.delete({ where: { accessoryId } });
  }
}
