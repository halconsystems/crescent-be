import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AppUser, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';

type AppUserPublic = Omit<AppUser, 'passwordHash'>;

@Injectable()
export class AppUsersService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublic(user: AppUser): AppUserPublic {
    const { passwordHash: _p, ...rest } = user;
    return rest;
  }

  async create(dto: CreateAppUserDto) {
    if (dto.employeeId != null) {
      const emp = await this.prisma.employee.findUnique({
        where: { employeeId: dto.employeeId },
      });
      if (!emp) throw new NotFoundException(`Employee ${dto.employeeId} not found`);
      const existing = await this.prisma.appUser.findUnique({
        where: { employeeId: dto.employeeId },
      });
      if (existing) {
        throw new ConflictException(`Employee ${dto.employeeId} already linked to a user`);
      }
    }
    if (dto.createdByUserId != null) {
      await this.findOneRaw(dto.createdByUserId);
    }
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.appUser.create({
      data: {
        employeeId: dto.employeeId,
        userName: dto.userName,
        passwordHash,
        isTempPassword: dto.isTempPassword ?? true,
        mustChangePassword: dto.mustChangePassword ?? true,
        isEmailVerified: dto.isEmailVerified ?? false,
        isMobileVerified: dto.isMobileVerified ?? false,
        isActive: dto.isActive ?? true,
        isLocked: dto.isLocked ?? false,
        createdByUserId: dto.createdByUserId,
      },
    });
    return this.toPublic(user);
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
    if (dto.employeeId != null) {
      const emp = await this.prisma.employee.findUnique({
        where: { employeeId: dto.employeeId },
      });
      if (!emp) throw new NotFoundException(`Employee ${dto.employeeId} not found`);
    }
    if (dto.createdByUserId != null) {
      await this.findOneRaw(dto.createdByUserId);
    }
    const data: Prisma.AppUserUncheckedUpdateInput = {};
    if (dto.employeeId !== undefined) data.employeeId = dto.employeeId;
    if (dto.userName !== undefined) data.userName = dto.userName;
    if (dto.isTempPassword !== undefined) data.isTempPassword = dto.isTempPassword;
    if (dto.mustChangePassword !== undefined) data.mustChangePassword = dto.mustChangePassword;
    if (dto.isEmailVerified !== undefined) data.isEmailVerified = dto.isEmailVerified;
    if (dto.isMobileVerified !== undefined) data.isMobileVerified = dto.isMobileVerified;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.isLocked !== undefined) data.isLocked = dto.isLocked;
    if (dto.failedLoginAttempts !== undefined) data.failedLoginAttempts = dto.failedLoginAttempts;
    if (dto.createdByUserId !== undefined) data.createdByUserId = dto.createdByUserId;
    if (dto.lastLoginAt !== undefined) {
      data.lastLoginAt = dto.lastLoginAt ? new Date(dto.lastLoginAt) : null;
    }
    if (dto.lastPasswordChangedAt !== undefined) {
      data.lastPasswordChangedAt = dto.lastPasswordChangedAt
        ? new Date(dto.lastPasswordChangedAt)
        : null;
    }
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
