import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';

@Injectable()
export class SimsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSimDto) {
    return this.prisma.sim.create({
      data: {
        simName: dto.simName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.sim.findMany({ orderBy: { simId: 'asc' } });
  }

  async findOne(simId: number) {
    const row = await this.prisma.sim.findUnique({ where: { simId } });
    if (!row) throw new NotFoundException(`SIM ${simId} not found`);
    return row;
  }

  async update(simId: number, dto: UpdateSimDto) {
    await this.findOne(simId);
    return this.prisma.sim.update({ where: { simId }, data: dto });
  }

  async remove(simId: number) {
    await this.findOne(simId);
    return this.prisma.sim.delete({ where: { simId } });
  }
}
