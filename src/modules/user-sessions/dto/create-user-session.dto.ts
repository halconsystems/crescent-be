import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserSessionDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ description: 'Plain refresh token; stored as Argon2 hash' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jwtId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipv4?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipv6?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  expiresAt: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  lastUsedAt?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  revokedAt?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  revokedReason?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  replacedBySessionId?: number | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
