/** Permission codes aligned with docs/client Table + RBAC.md */
export const PORTAL_PERMISSION_DEFS: ReadonlyArray<{ code: string; description: string }> = [
  { code: 'sales.create', description: 'Create a new sale' },
  { code: 'sales.view', description: 'View sales' },
  { code: 'sales.edit.client', description: 'Edit sales-stage client fields' },
  { code: 'sales.edit.product', description: 'Edit sales-stage product fields' },
  { code: 'sales.submit.accounts', description: 'Submit sale to accounts' },
  { code: 'accounts.view', description: 'View accounts stage' },
  { code: 'accounts.review', description: 'Review accounts stage' },
  { code: 'accounts.hold', description: 'Hold at accounts' },
  { code: 'accounts.approve', description: 'Approve accounts' },
  { code: 'accounts.reject', description: 'Reject at accounts' },
  { code: 'operations.view', description: 'View operations stage' },
  { code: 'operations.assign.device', description: 'Assign device / combo / SIM / accessories' },
  { code: 'operations.assign.technician', description: 'Assign technician user' },
  { code: 'operations.submit.technician', description: 'Hand off to technician stage' },
  { code: 'technician.view', description: 'View technician / installation data' },
  { code: 'technician.install.complete', description: 'Complete installation workflow' },
  { code: 'technician.install.edit', description: 'Edit installation fields' },
  { code: 'sales.reopen', description: 'Reopen a sale stage (admin)' },
  { code: 'sales.audit.view', description: 'View sale audit log' },
] as const;

export const PORTAL_PERMISSION_CODES = PORTAL_PERMISSION_DEFS.map((p) => p.code);

export const PERMISSIONS_METADATA_KEY = 'portal:permissions';

export type PermissionRequirement = {
  codes: string[];
  mode: 'any' | 'all';
};
