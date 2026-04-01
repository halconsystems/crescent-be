import { Module } from '@nestjs/common';
import { UserPasswordHistoryController } from './user-password-history.controller';
import { UserPasswordHistoryService } from './user-password-history.service';

@Module({
  controllers: [UserPasswordHistoryController],
  providers: [UserPasswordHistoryService],
})
export class UserPasswordHistoryModule {}
