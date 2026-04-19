import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { PORTAL_PERMISSION_DEFS } from '../src/common/rbac/portal-permissions';

const prisma = new PrismaClient();

const ADMIN_ROLE = 'System Administrator';
const ADMIN_EMAIL = 'admin@halcon.com';
const ADMIN_PASSWORD = 'Admin123';

async function main() {
  const adminPasswordHash = await argon2.hash(ADMIN_PASSWORD);

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

  // Ensure System Administrator always has every permission in DB (including future/manual additions).
  const permissions = await prisma.permission.findMany();

  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: role.roleId, permissionId: perm.permissionId },
      },
      create: { roleId: role.roleId, permissionId: perm.permissionId },
      update: {},
    });
  }

  const adminUser = await prisma.appUser.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      dob: new Date('1990-01-01T00:00:00.000Z'),
      cnic: '42201-0000000-1',
      contactNo: '+920000000000',
      address: 'System Seed User',
    },
    update: {
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.userId,
        roleId: role.roleId,
      },
    },
    create: {
      userId: adminUser.userId,
      roleId: role.roleId,
      assignedByUserId: adminUser.userId,
    },
    update: {},
  });

  console.log(`Linked ${permissions.length} total permissions to role "${ADMIN_ROLE}" (roleId=${role.roleId}).`);
  console.log(`Ensured admin user "${ADMIN_EMAIL}" exists and is assigned "${ADMIN_ROLE}".`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
