import { Module } from '@nestjs/common';
import { PasswordResetTokensController } from './password-reset-tokens.controller';
import { PasswordResetTokensService } from './password-reset-tokens.service';

@Module({
  controllers: [PasswordResetTokensController],
  providers: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
