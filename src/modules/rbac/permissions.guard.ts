import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_METADATA_KEY, PermissionRequirement } from '../../common/rbac/portal-permissions';
import { UserPermissionsService } from './user-permissions.service';

type JwtUser = { userId: number; email: string };

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userPermissions: UserPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<PermissionRequirement | undefined>(
      PERMISSIONS_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requirement || requirement.codes.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<{ user?: JwtUser }>();
    const user = req.user;
    if (user?.userId == null) {
      throw new UnauthorizedException();
    }

    const granted = await this.userPermissions.getPermissionCodesForUser(user.userId);
    const ok =
      requirement.mode === 'all'
        ? requirement.codes.every((c) => granted.has(c))
        : requirement.codes.some((c) => granted.has(c));

    if (!ok) {
      throw new ForbiddenException('Missing required permission for this action');
    }
    return true;
  }
}
