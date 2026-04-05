import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jdoe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'SecurePass1!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: String, format: 'date-time', example: '1990-01-01T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  dob: string;

  @ApiProperty({ example: '35202-1234567-1' })
  @IsNotEmpty()
  @IsString()
  cnic: string;

  @ApiProperty({ example: '+923001234567' })
  @IsNotEmpty()
  @IsString()
  contactNo: string;

  @ApiProperty({ example: 'Street 1, City' })
  @IsNotEmpty()
  @IsString()
  address: string;
}
