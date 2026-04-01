import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCityDto) {
    return this.prisma.city.create({
      data: {
        cityName: dto.cityName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.city.findMany({ orderBy: { cityId: 'asc' } });
  }

  async findOne(cityId: number) {
    const row = await this.prisma.city.findUnique({ where: { cityId } });
    if (!row) throw new NotFoundException(`City ${cityId} not found`);
    return row;
  }

  async update(cityId: number, dto: UpdateCityDto) {
    await this.findOne(cityId);
    return this.prisma.city.update({ where: { cityId }, data: dto });
  }

  async remove(cityId: number) {
    await this.findOne(cityId);
    return this.prisma.city.delete({ where: { cityId } });
  }
}
