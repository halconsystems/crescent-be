import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.appUser.findUnique({ where: { userName: username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive || user.isLocked) {
      throw new UnauthorizedException('User is disabled or locked');
    }
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload: JwtPayload = { sub: user.userId, username: user.userName };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user,
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
// auth service
