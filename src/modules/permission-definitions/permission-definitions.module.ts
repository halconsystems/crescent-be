import { Module } from '@nestjs/common';
import { PermissionDefinitionsController } from './permission-definitions.controller';
import { PermissionDefinitionsService } from './permission-definitions.service';

@Module({
  controllers: [PermissionDefinitionsController],
  providers: [PermissionDefinitionsService],
})
export class PermissionDefinitionsModule {}
