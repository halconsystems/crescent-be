import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BanksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateBankDto) {
    return this.prisma.bank.create({
      data: {
        bankName: dto.bankName,
        bankCode: dto.bankCode,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.bank.findMany({ orderBy: { bankId: 'asc' } });
  }

  async findOne(bankId: number) {
    const row = await this.prisma.bank.findUnique({ where: { bankId } });
    if (!row) throw new NotFoundException(`Bank ${bankId} not found`);
    return row;
  }

  async update(bankId: number, dto: UpdateBankDto) {
    await this.findOne(bankId);
    return this.prisma.bank.update({ where: { bankId }, data: dto });
  }

  async remove(bankId: number) {
    await this.findOne(bankId);
    return this.prisma.bank.delete({ where: { bankId } });
  }
}
