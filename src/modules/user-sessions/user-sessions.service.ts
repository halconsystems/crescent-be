import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSession } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';

type SessionPublic = Omit<UserSession, 'refreshTokenHash'>;

@Injectable()
export class UserSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublic(row: UserSession): SessionPublic {
    const { refreshTokenHash: _r, ...rest } = row;
    return rest;
  }

  async create(dto: CreateUserSessionDto) {
    const user = await this.prisma.appUser.findUnique({ where: { userId: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
    if (dto.replacedBySessionId != null) {
      const s = await this.prisma.userSession.findUnique({
        where: { sessionId: dto.replacedBySessionId },
      });
      if (!s) throw new NotFoundException(`Session ${dto.replacedBySessionId} not found`);
    }
    const issuedAt = new Date();
    const expiresAt = new Date(dto.expiresAt);
    if (expiresAt <= issuedAt) {
      throw new BadRequestException('expiresAt must be after issuedAt');
    }
    const refreshTokenHash = await argon2.hash(dto.refreshToken);
    const row = await this.prisma.userSession.create({
      data: {
        userId: dto.userId,
        refreshTokenHash,
        jwtId: dto.jwtId,
        deviceInfo: dto.deviceInfo,
        ipv4: dto.ipv4,
        ipv6: dto.ipv6,
        userAgent: dto.userAgent,
        issuedAt,
        expiresAt,
        lastUsedAt: dto.lastUsedAt ? new Date(dto.lastUsedAt) : null,
        revokedAt: dto.revokedAt ? new Date(dto.revokedAt) : null,
        revokedReason: dto.revokedReason,
        replacedBySessionId: dto.replacedBySessionId,
        isActive: dto.isActive ?? true,
      },
    });
    return this.toPublic(row);
  }

  findAll(userId?: number) {
    return this.prisma.userSession
      .findMany({
        where: userId ? { userId } : undefined,
        orderBy: { sessionId: 'desc' },
      })
      .then((rows) => rows.map((r) => this.toPublic(r)));
  }

  async findOne(sessionId: number) {
    const row = await this.prisma.userSession.findUnique({ where: { sessionId } });
    if (!row) throw new NotFoundException(`Session ${sessionId} not found`);
    return this.toPublic(row);
  }

  async update(sessionId: number, dto: UpdateUserSessionDto) {
    const existing = await this.prisma.userSession.findUnique({ where: { sessionId } });
    if (!existing) throw new NotFoundException(`Session ${sessionId} not found`);
    if (dto.replacedBySessionId != null) {
      const s = await this.prisma.userSession.findUnique({
        where: { sessionId: dto.replacedBySessionId },
      });
      if (!s) throw new NotFoundException(`Session ${dto.replacedBySessionId} not found`);
    }
    const row = await this.prisma.userSession.update({
      where: { sessionId },
      data: {
        jwtId: dto.jwtId,
        deviceInfo: dto.deviceInfo,
        ipv4: dto.ipv4,
        ipv6: dto.ipv6,
        userAgent: dto.userAgent,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        lastUsedAt:
          dto.lastUsedAt !== undefined
            ? dto.lastUsedAt
              ? new Date(dto.lastUsedAt)
              : null
            : undefined,
        revokedAt:
          dto.revokedAt !== undefined
            ? dto.revokedAt
              ? new Date(dto.revokedAt)
              : null
            : undefined,
        revokedReason: dto.revokedReason,
        replacedBySessionId: dto.replacedBySessionId,
        isActive: dto.isActive,
      },
    });
    return this.toPublic(row);
  }

  async remove(sessionId: number) {
    const row = await this.prisma.userSession.findUnique({ where: { sessionId } });
    if (!row) throw new NotFoundException(`Session ${sessionId} not found`);
    const deleted = await this.prisma.userSession.delete({ where: { sessionId } });
    return this.toPublic(deleted);
  }
}
