import { createHash } from 'crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password-reset-token.dto';

function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

@Injectable()
export class PasswordResetTokensService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePasswordResetTokenDto) {
    const user = await this.prisma.appUser.findUnique({ where: { userId: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
    const requestedAt = new Date();
    const expiresAt = new Date(dto.expiresAt);
    if (expiresAt <= requestedAt) {
      throw new BadRequestException('expiresAt must be after requested time');
    }
    return this.prisma.passwordResetToken.create({
      data: {
        userId: dto.userId,
        tokenHash: hashToken(dto.token),
        requestedAt,
        expiresAt,
        usedAt: dto.usedAt ? new Date(dto.usedAt) : null,
        requestedIp: dto.requestedIp,
        requestedUserAgent: dto.requestedUserAgent,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll(userId?: number) {
    return this.prisma.passwordResetToken.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { resetTokenId: 'desc' },
    });
  }

  async findOne(resetTokenId: number) {
    const row = await this.prisma.passwordResetToken.findUnique({
      where: { resetTokenId },
    });
    if (!row) throw new NotFoundException(`Password reset token ${resetTokenId} not found`);
    return row;
  }

  async update(resetTokenId: number, dto: UpdatePasswordResetTokenDto) {
    await this.findOne(resetTokenId);
    return this.prisma.passwordResetToken.update({
      where: { resetTokenId },
      data: {
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        usedAt: dto.usedAt !== undefined ? (dto.usedAt ? new Date(dto.usedAt) : null) : undefined,
        requestedIp: dto.requestedIp,
        requestedUserAgent: dto.requestedUserAgent,
        isActive: dto.isActive,
      },
    });
  }

  async remove(resetTokenId: number) {
    await this.findOne(resetTokenId);
    return this.prisma.passwordResetToken.delete({ where: { resetTokenId } });
  }
}
