import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const zone = await this.prisma.zone.findUnique({
      where: { zoneId },
      select: {
        zoneId: true,
        _count: {
          select: {
            zoneEmployees: true,
            saleOperationsAssignments: true,
          },
        },
      },
    });
    if (!zone) throw new NotFoundException(`Zone ${zoneId} not found`);

    if (zone._count.zoneEmployees > 0 || zone._count.saleOperationsAssignments > 0) {
      throw new BadRequestException(
        `Zone ${zoneId} cannot be deleted because it is referenced by related records`,
      );
    }

    return this.prisma.zone.delete({ where: { zoneId } });
  }
}
