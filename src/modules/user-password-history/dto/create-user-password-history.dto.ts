import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateUserPasswordHistoryDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ minLength: 8, description: 'Plain password; stored as Argon2 hash' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
