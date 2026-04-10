import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccountsDecision } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchAccountsStageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  accountsRemark?: string;

  @ApiPropertyOptional({ enum: AccountsDecision })
  @IsOptional()
  @IsEnum(AccountsDecision)
  decision?: AccountsDecision;
}
