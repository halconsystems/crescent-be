import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSimDto {
  @ApiProperty({ example: 'Data SIM 5G' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  simName: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
