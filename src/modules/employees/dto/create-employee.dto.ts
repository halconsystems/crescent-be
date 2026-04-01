import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DesignationType } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  emailId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryMobileNo?: string;

  @ApiProperty({ example: '35202-1234567-1' })
  @IsNotEmpty()
  @IsString()
  cnic: string;

  @ApiProperty({ enum: DesignationType })
  @IsEnum(DesignationType)
  designation: DesignationType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextOfKin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextOfKinContact?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
