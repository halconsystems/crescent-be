import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jdoe', description: 'Application username (`AppUser.userName`)' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'YourSecurePassword1!', format: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
