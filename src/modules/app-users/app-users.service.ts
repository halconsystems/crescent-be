import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppUser, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import {
  generateRefreshToken,
  getRefreshTokenExpiresAt,
  hashRefreshToken,
} from '../auth/refresh-token.util';

type AppUserPublic = Omit<AppUser, 'passwordHash'>;

@Injectable()
export class AppUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private toPublic(user: AppUser): AppUserPublic {
    const { passwordHash: _p, ...rest } = user;
    return rest;
  }

  async create(dto: CreateAppUserDto) {
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.appUser.create({
      data: {
        email: dto.email,
        passwordHash,
        dob: new Date(dto.dob),
        cnic: dto.cnic,
        contactNo: dto.contactNo,
        address: dto.address,
      },
    });
    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      email: user.email,
    });
    const issuedAt = new Date();
    const refreshToken = generateRefreshToken();
    await this.prisma.refreshToken.create({
      data: {
        userId: user.userId,
        tokenHash: hashRefreshToken(refreshToken),
        issuedAt,
        expiresAt: getRefreshTokenExpiresAt(issuedAt),
      },
    });
    return { accessToken, refreshToken, user: this.toPublic(user) };
  }

  async findAll() {
    const rows = await this.prisma.appUser.findMany({
      orderBy: { userId: 'asc' },
    });
    return rows.map((u) => this.toPublic(u));
  }

  async findOne(userId: number) {
    const user = await this.findOneRaw(userId);
    return this.toPublic(user);
  }

  private async findOneRaw(userId: number) {
    const row = await this.prisma.appUser.findUnique({ where: { userId } });
    if (!row) throw new NotFoundException(`User ${userId} not found`);
    return row;
  }

  async update(userId: number, dto: UpdateAppUserDto) {
    await this.findOneRaw(userId);
    const data: Prisma.AppUserUncheckedUpdateInput = {};
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.dob !== undefined) data.dob = new Date(dto.dob);
    if (dto.cnic !== undefined) data.cnic = dto.cnic;
    if (dto.contactNo !== undefined) data.contactNo = dto.contactNo;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.password) {
      data.passwordHash = await argon2.hash(dto.password);
    }
    const user = await this.prisma.appUser.update({
      where: { userId },
      data,
    });
    return this.toPublic(user);
  }

  async remove(userId: number) {
    await this.findOneRaw(userId);
    const user = await this.prisma.appUser.delete({ where: { userId } });
    return this.toPublic(user);
  }
}
