import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVendorDto) {
    if (dto.cityId != null) {
      const city = await this.prisma.city.findUnique({ where: { cityId: dto.cityId } });
      if (!city) throw new NotFoundException(`City ${dto.cityId} not found`);
    }
    return this.prisma.vendor.create({
      data: {
        vendorName: dto.vendorName,
        cityId: dto.cityId,
        address: dto.address,
        emailId: dto.emailId,
        contactPerson: dto.contactPerson,
        primaryMobile: dto.primaryMobile,
        secondaryMobile: dto.secondaryMobile,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll(cityId?: number) {
    return this.prisma.vendor.findMany({
      where: cityId ? { cityId } : undefined,
      orderBy: { vendorId: 'asc' },
    });
  }

  async findOne(vendorId: number) {
    const row = await this.prisma.vendor.findUnique({ where: { vendorId } });
    if (!row) throw new NotFoundException(`Vendor ${vendorId} not found`);
    return row;
  }

  async update(vendorId: number, dto: UpdateVendorDto) {
    await this.findOne(vendorId);
    if (dto.cityId != null) {
      const city = await this.prisma.city.findUnique({ where: { cityId: dto.cityId } });
      if (!city) throw new NotFoundException(`City ${dto.cityId} not found`);
    }
    return this.prisma.vendor.update({ where: { vendorId }, data: dto });
  }

  async remove(vendorId: number) {
    await this.findOne(vendorId);
    return this.prisma.vendor.delete({ where: { vendorId } });
  }
}
