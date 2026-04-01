import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty({ example: 'HBL' })
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiPropertyOptional({ example: 'HBL' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
