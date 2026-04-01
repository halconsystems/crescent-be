import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClientCategoryDto } from './dto/create-client-category.dto';
import { UpdateClientCategoryDto } from './dto/update-client-category.dto';

@Injectable()
export class ClientCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateClientCategoryDto) {
    return this.prisma.clientCategory.create({
      data: {
        categoryName: dto.categoryName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.clientCategory.findMany({ orderBy: { categoryId: 'asc' } });
  }

  async findOne(categoryId: number) {
    const row = await this.prisma.clientCategory.findUnique({ where: { categoryId } });
    if (!row) throw new NotFoundException(`Client category ${categoryId} not found`);
    return row;
  }

  async update(categoryId: number, dto: UpdateClientCategoryDto) {
    await this.findOne(categoryId);
    return this.prisma.clientCategory.update({ where: { categoryId }, data: dto });
  }

  async remove(categoryId: number) {
    await this.findOne(categoryId);
    return this.prisma.clientCategory.delete({ where: { categoryId } });
  }
}
