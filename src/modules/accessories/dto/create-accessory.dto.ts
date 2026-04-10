import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccessoryDto {
  @ApiProperty({ example: 'Mounting bracket' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  accessoryName: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
