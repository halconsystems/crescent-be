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

export class CreatePasswordResetTokenDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ description: 'Plain token; stored as SHA-256 hex' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  expiresAt: string;

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

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
