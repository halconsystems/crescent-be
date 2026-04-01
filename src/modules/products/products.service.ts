import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        productName: dto.productName,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({ orderBy: { productId: 'asc' } });
  }

  async findOne(productId: number) {
    const row = await this.prisma.product.findUnique({ where: { productId } });
    if (!row) throw new NotFoundException(`Product ${productId} not found`);
    return row;
  }

  async update(productId: number, dto: UpdateProductDto) {
    await this.findOne(productId);
    return this.prisma.product.update({ where: { productId }, data: dto });
  }

  async remove(productId: number) {
    await this.findOne(productId);
    return this.prisma.product.delete({ where: { productId } });
  }
}
