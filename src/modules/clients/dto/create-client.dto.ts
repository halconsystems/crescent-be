import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'Client full name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Client email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '35202-1234567-1', description: 'Client CNIC number' })
  @IsNotEmpty()
  @IsString()
  cnic: string;

  @ApiProperty({ example: 'IR-1001', description: 'Internal reference number' })
  @IsNotEmpty()
  @IsString()
  irNo: string;

  @ApiProperty({ example: '+923001234567', description: 'Client phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
