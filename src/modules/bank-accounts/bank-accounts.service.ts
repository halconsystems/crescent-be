import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBankAccountDto) {
    const bank = await this.prisma.bank.findUnique({ where: { bankId: dto.bankId } });
    if (!bank) throw new NotFoundException(`Bank ${dto.bankId} not found`);
    return this.prisma.bankAccount.create({
      data: {
        bankId: dto.bankId,
        accountNo: dto.accountNo,
        iban: dto.iban,
        branchCode: dto.branchCode,
        branch: dto.branch,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll(bankId?: number) {
    return this.prisma.bankAccount.findMany({
      where: bankId ? { bankId } : undefined,
      orderBy: { bankAccountId: 'asc' },
    });
  }

  async findOne(bankAccountId: number) {
    const row = await this.prisma.bankAccount.findUnique({ where: { bankAccountId } });
    if (!row) throw new NotFoundException(`Bank account ${bankAccountId} not found`);
    return row;
  }

  async update(bankAccountId: number, dto: UpdateBankAccountDto) {
    await this.findOne(bankAccountId);
    return this.prisma.bankAccount.update({
      where: { bankAccountId },
      data: dto,
    });
  }

  async remove(bankAccountId: number) {
    await this.findOne(bankAccountId);
    return this.prisma.bankAccount.delete({ where: { bankAccountId } });
  }
}
