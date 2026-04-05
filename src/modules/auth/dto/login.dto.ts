import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jdoe@example.com', description: 'Application email (`AppUser.email`)' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'YourSecurePassword1!', format: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
