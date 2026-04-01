import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePackageDto) {
    return this.prisma.package.create({
      data: {
        packageName: dto.packageName,
        minCharges: dto.minCharges,
        minRenewalCharges: dto.minRenewalCharges,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.package.findMany({ orderBy: { packageId: 'asc' } });
  }

  async findOne(packageId: number) {
    const row = await this.prisma.package.findUnique({ where: { packageId } });
    if (!row) throw new NotFoundException(`Package ${packageId} not found`);
    return row;
  }

  async update(packageId: number, dto: UpdatePackageDto) {
    await this.findOne(packageId);
    return this.prisma.package.update({
      where: { packageId },
      data: {
        packageName: dto.packageName,
        minCharges: dto.minCharges,
        minRenewalCharges: dto.minRenewalCharges,
        isActive: dto.isActive,
      },
    });
  }

  async remove(packageId: number) {
    await this.findOne(packageId);
    return this.prisma.package.delete({ where: { packageId } });
  }
}
