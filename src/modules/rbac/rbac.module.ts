import { Global, Module } from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { PermissionsGuard } from './permissions.guard';

@Global()
@Module({
  providers: [UserPermissionsService, PermissionsGuard],
  exports: [UserPermissionsService, PermissionsGuard],
})
export class RbacModule {}
