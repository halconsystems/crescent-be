import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({ example: 'Tracker X1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  deviceName: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
