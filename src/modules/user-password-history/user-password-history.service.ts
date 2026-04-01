import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserPasswordHistoryDto } from './dto/create-user-password-history.dto';

@Injectable()
export class UserPasswordHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserPasswordHistoryDto) {
    const user = await this.prisma.appUser.findUnique({ where: { userId: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
    const passwordHash = await argon2.hash(dto.password);
    const row = await this.prisma.userPasswordHistory.create({
      data: {
        userId: dto.userId,
        passwordHash,
      },
    });
    const { passwordHash: _h, ...rest } = row;
    return rest;
  }

  findAll(userId?: number) {
    return this.prisma.userPasswordHistory.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { passwordHistoryId: 'desc' },
      select: {
        passwordHistoryId: true,
        userId: true,
        createdAt: true,
      },
    });
  }

  async findOne(passwordHistoryId: number) {
    const row = await this.prisma.userPasswordHistory.findUnique({
      where: { passwordHistoryId },
      select: {
        passwordHistoryId: true,
        userId: true,
        createdAt: true,
      },
    });
    if (!row) throw new NotFoundException(`Password history ${passwordHistoryId} not found`);
    return row;
  }

  async remove(passwordHistoryId: number) {
    await this.findOne(passwordHistoryId);
    return this.prisma.userPasswordHistory.delete({ where: { passwordHistoryId } });
  }
}
