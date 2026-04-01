import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePasswordResetTokenDto {
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  usedAt?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requestedIp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requestedUserAgent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
