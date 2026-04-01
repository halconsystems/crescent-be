import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';

@Injectable()
export class OfficesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOfficeDto) {
    return this.prisma.office.create({
      data: {
        officeName: dto.officeName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.office.findMany({ orderBy: { officeId: 'asc' } });
  }

  async findOne(officeId: number) {
    const row = await this.prisma.office.findUnique({ where: { officeId } });
    if (!row) throw new NotFoundException(`Office ${officeId} not found`);
    return row;
  }

  async update(officeId: number, dto: UpdateOfficeDto) {
    await this.findOne(officeId);
    return this.prisma.office.update({
      where: { officeId },
      data: dto,
    });
  }

  async remove(officeId: number) {
    await this.findOne(officeId);
    return this.prisma.office.delete({ where: { officeId } });
  }
}
