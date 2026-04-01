import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateUserSessionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jwtId?: string | null;

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

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
