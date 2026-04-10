import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: {
        deviceName: dto.deviceName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.device.findMany({ orderBy: { deviceId: 'asc' } });
  }

  async findOne(deviceId: number) {
    const row = await this.prisma.device.findUnique({ where: { deviceId } });
    if (!row) throw new NotFoundException(`Device ${deviceId} not found`);
    return row;
  }

  async update(deviceId: number, dto: UpdateDeviceDto) {
    await this.findOne(deviceId);
    return this.prisma.device.update({ where: { deviceId }, data: dto });
  }

  async remove(deviceId: number) {
    await this.findOne(deviceId);
    return this.prisma.device.delete({ where: { deviceId } });
  }
}
