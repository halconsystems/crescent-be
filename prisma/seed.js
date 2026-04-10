"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ADMIN_ROLE = 'System Administrator';
const PORTAL_PERMISSION_DEFS = [
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
];
async function main() {
    for (const p of PORTAL_PERMISSION_DEFS) {
        await prisma.permission.upsert({
            where: { permissionCode: p.code },
            create: { permissionCode: p.code, description: p.description, isActive: true },
            update: { description: p.description, isActive: true },
        });
    }
    const role = await prisma.role.upsert({
        where: { roleName: ADMIN_ROLE },
        create: { roleName: ADMIN_ROLE, description: 'Full portal access (seed)', isActive: true },
        update: { isActive: true },
    });
    const permissions = await prisma.permission.findMany({
        where: { permissionCode: { in: PORTAL_PERMISSION_DEFS.map((d) => d.code) } },
    });
    for (const perm of permissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: { roleId: role.roleId, permissionId: perm.permissionId },
            },
            create: { roleId: role.roleId, permissionId: perm.permissionId },
            update: {},
        });
    }
    console.log(`Seeded ${permissions.length} permissions and linked to role "${ADMIN_ROLE}" (roleId=${role.roleId}).`);
    console.log('Assign this role to users via POST /api/v1/user-roles if needed.');
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map