import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import {
  generateRefreshToken,
  getRefreshTokenExpiresAt,
  hashRefreshToken,
} from './refresh-token.util';

export interface JwtPayload {
  sub: number;
  email: string;
}

type RefreshTokenMeta = {
  userAgent?: string | null;
  ipv4?: string | null;
  ipv6?: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.appUser.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { passwordHash, ...rest } = user;
    return rest;
  }

  private async createRefreshToken(userId: number, meta?: RefreshTokenMeta) {
    const issuedAt = new Date();
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const record = await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        issuedAt,
        expiresAt: getRefreshTokenExpiresAt(issuedAt),
        userAgent: meta?.userAgent ?? null,
        ipv4: meta?.ipv4 ?? null,
        ipv6: meta?.ipv6 ?? null,
      },
    });
    return { refreshToken, record };
  }

  async login(email: string, password: string, meta?: RefreshTokenMeta) {
    const user = await this.validateUser(email, password);
    const payload: JwtPayload = { sub: user.userId, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const { refreshToken } = await this.createRefreshToken(user.userId, meta);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refresh(refreshToken: string, meta?: RefreshTokenMeta) {
    const tokenHash = hashRefreshToken(refreshToken);
    const existing = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!existing || existing.revokedAt || existing.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.appUser.findUnique({ where: { userId: existing.userId } });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const now = new Date();
    const newRefreshToken = generateRefreshToken();
    await this.prisma.$transaction(async (tx) => {
      const created = await tx.refreshToken.create({
        data: {
          userId: existing.userId,
          tokenHash: hashRefreshToken(newRefreshToken),
          issuedAt: now,
          expiresAt: getRefreshTokenExpiresAt(now),
          userAgent: meta?.userAgent ?? null,
          ipv4: meta?.ipv4 ?? null,
          ipv6: meta?.ipv6 ?? null,
        },
      });
      await tx.refreshToken.update({
        where: { refreshTokenId: existing.refreshTokenId },
        data: {
          revokedAt: now,
          revokedReason: 'rotated',
          replacedByTokenId: created.refreshTokenId,
        },
      });
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      email: user.email,
    });
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    const existing = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!existing || existing.revokedAt) {
      return { revoked: false };
    }
    await this.prisma.refreshToken.update({
      where: { refreshTokenId: existing.refreshTokenId },
      data: { revokedAt: new Date(), revokedReason: 'logout' },
    });
    return { revoked: true };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
// auth service
