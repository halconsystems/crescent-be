import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_METADATA_KEY, PermissionRequirement } from './portal-permissions';

/** User must have at least one of the listed permissions (typical for stage PATCH). */
export const RequirePermissions = (...codes: string[]) =>
  SetMetadata(PERMISSIONS_METADATA_KEY, { codes, mode: 'any' } satisfies PermissionRequirement);

/** User must have every listed permission. */
export const RequireAllPermissions = (...codes: string[]) =>
  SetMetadata(PERMISSIONS_METADATA_KEY, { codes, mode: 'all' } satisfies PermissionRequirement);
