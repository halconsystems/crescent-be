import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZonesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateZoneDto) {
    const office = await this.prisma.office.findUnique({
      where: { officeId: dto.officeId },
    });
    if (!office) throw new NotFoundException(`Office ${dto.officeId} not found`);
    return this.prisma.zone.create({
      data: {
        officeId: dto.officeId,
        zoneName: dto.zoneName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll(officeId?: number) {
    return this.prisma.zone.findMany({
      where: officeId ? { officeId } : undefined,
      orderBy: { zoneId: 'asc' },
    });
  }

  async findOne(zoneId: number) {
    const row = await this.prisma.zone.findUnique({ where: { zoneId } });
    if (!row) throw new NotFoundException(`Zone ${zoneId} not found`);
    return row;
  }

  async update(zoneId: number, dto: UpdateZoneDto) {
    await this.findOne(zoneId);
    return this.prisma.zone.update({
      where: { zoneId },
      data: dto,
    });
  }

  async remove(zoneId: number) {
    await this.findOne(zoneId);
    return this.prisma.zone.delete({ where: { zoneId } });
  }
}
