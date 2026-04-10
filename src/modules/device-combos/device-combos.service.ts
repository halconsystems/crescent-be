import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeviceComboDto } from './dto/create-device-combo.dto';
import { UpdateDeviceComboDto } from './dto/update-device-combo.dto';

@Injectable()
export class DeviceCombosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDeviceComboDto) {
    return this.prisma.deviceCombo.create({
      data: {
        comboName: dto.comboName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.deviceCombo.findMany({ orderBy: { deviceComboId: 'asc' } });
  }

  async findOne(deviceComboId: number) {
    const row = await this.prisma.deviceCombo.findUnique({ where: { deviceComboId } });
    if (!row) throw new NotFoundException(`Device combo ${deviceComboId} not found`);
    return row;
  }

  async update(deviceComboId: number, dto: UpdateDeviceComboDto) {
    await this.findOne(deviceComboId);
    return this.prisma.deviceCombo.update({ where: { deviceComboId }, data: dto });
  }

  async remove(deviceComboId: number) {
    await this.findOne(deviceComboId);
    return this.prisma.deviceCombo.delete({ where: { deviceComboId } });
  }
}
