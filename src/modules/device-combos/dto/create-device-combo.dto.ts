import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeviceComboDto {
  @ApiProperty({ example: 'GPS + Camera' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  comboName: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
