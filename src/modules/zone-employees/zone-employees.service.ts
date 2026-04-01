import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateZoneEmployeeDto } from './dto/create-zone-employee.dto';
import { UpdateZoneEmployeeDto } from './dto/update-zone-employee.dto';

@Injectable()
export class ZoneEmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateZoneEmployeeDto) {
    const zone = await this.prisma.zone.findUnique({ where: { zoneId: dto.zoneId } });
    if (!zone) throw new NotFoundException(`Zone ${dto.zoneId} not found`);
    const emp = await this.prisma.employee.findUnique({ where: { employeeId: dto.employeeId } });
    if (!emp) throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    const dup = await this.prisma.zoneEmployee.findFirst({
      where: { zoneId: dto.zoneId, employeeId: dto.employeeId },
    });
    if (dup) {
      throw new ConflictException(`Employee ${dto.employeeId} already assigned to zone ${dto.zoneId}`);
    }
    return this.prisma.zoneEmployee.create({
      data: { zoneId: dto.zoneId, employeeId: dto.employeeId },
    });
  }

  findAll(zoneId?: number, employeeId?: number) {
    return this.prisma.zoneEmployee.findMany({
      where: {
        ...(zoneId ? { zoneId } : {}),
        ...(employeeId ? { employeeId } : {}),
      },
      orderBy: { zoneEmployeeId: 'asc' },
    });
  }

  async findOne(zoneEmployeeId: number) {
    const row = await this.prisma.zoneEmployee.findUnique({ where: { zoneEmployeeId } });
    if (!row) throw new NotFoundException(`Zone employee ${zoneEmployeeId} not found`);
    return row;
  }

  async update(zoneEmployeeId: number, dto: UpdateZoneEmployeeDto) {
    await this.findOne(zoneEmployeeId);
    if (dto.zoneId != null) {
      const z = await this.prisma.zone.findUnique({ where: { zoneId: dto.zoneId } });
      if (!z) throw new NotFoundException(`Zone ${dto.zoneId} not found`);
    }
    if (dto.employeeId != null) {
      const e = await this.prisma.employee.findUnique({ where: { employeeId: dto.employeeId } });
      if (!e) throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    }
    return this.prisma.zoneEmployee.update({
      where: { zoneEmployeeId },
      data: dto,
    });
  }

  async remove(zoneEmployeeId: number) {
    await this.findOne(zoneEmployeeId);
    return this.prisma.zoneEmployee.delete({ where: { zoneEmployeeId } });
  }
}
