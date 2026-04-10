import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateRolePermissionDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  roleId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  permissionId: number;
}
