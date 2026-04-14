import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AccountsDecision,
  Prisma,
  SaleStageCode,
  StageStatus,
} from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { UserPermissionsService } from '../rbac/user-permissions.service';
import { PatchAccountsStageDto } from './dto/patch-accounts-stage.dto';
import { PatchOperationsStageDto } from './dto/patch-operations-stage.dto';
import { PatchSalesStageDto } from './dto/patch-sales-stage.dto';
import { PatchTechnicianStageDto } from './dto/patch-technician-stage.dto';

const STAGES: SaleStageCode[] = ['SALES', 'ACCOUNTS', 'OPERATIONS', 'TECHNICIAN'];

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userPermissions: UserPermissionsService,
  ) {}

  private saleInclude() {
    return {
      clientDetails: true,
      productDetails: true,
      accountsReview: true,
      operationsAssignment: true,
      installation: true,
      stageStatuses: true,
    } as const;
  }

  private async assertSale(saleId: number) {
    const sale = await this.prisma.sale.findUnique({
      where: { saleId },
      include: { ...this.saleInclude(), stageStatuses: true },
    });
    if (!sale || !sale.isActive) {
      throw new NotFoundException(`Sale ${saleId} not found`);
    }
    return sale;
  }

  private statusMap(stageStatuses: { stageCode: SaleStageCode; status: StageStatus }[]) {
    const m = new Map<SaleStageCode, StageStatus>();
    for (const s of stageStatuses) {
      m.set(s.stageCode, s.status);
    }
    return m;
  }

  private toDec(n?: number) {
    return n === undefined || n === null ? undefined : new Prisma.Decimal(n);
  }

  private str(v: unknown): string | null {
    if (v === undefined || v === null) return null;
    if (v instanceof Date) return v.toISOString();
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }

  private async audit(
    tx: Prisma.TransactionClient,
    saleId: number,
    userId: number,
    stage: SaleStageCode | null,
    field: string,
    oldVal: unknown,
    newVal: unknown,
  ) {
    await tx.saleAuditLog.create({
      data: {
        saleId,
        stageCode: stage ?? undefined,
        fieldName: field,
        oldValue: this.str(oldVal),
        newValue: this.str(newVal),
        changedByUserId: userId,
      },
    });
  }

  async create(userId: number, dto: PatchSalesStageDto = {}) {
    const saleCode = `SAL-${randomBytes(6).toString('hex').toUpperCase()}`;
    const sale = await this.prisma.sale.create({
      data: {
        saleCode,
        createdByUserId: userId,
        stageStatuses: {
          create: STAGES.map((stageCode) => ({
            stageCode,
            status:
              stageCode === 'SALES'
                ? StageStatus.IN_PROGRESS
                : StageStatus.PENDING,
            updatedByUserId: userId,
          })),
        },
      },
      include: this.saleInclude(),
    });

    const hasSalesStagePayload = Object.values(dto).some((value) => value !== undefined);
    if (!hasSalesStagePayload) {
      return sale;
    }

    return this.patchSalesStage(sale.saleId, userId, dto);
  }

  findAll() {
    return this.prisma.sale.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: this.saleInclude(),
    });
  }

  async findOne(saleId: number) {
    return this.assertSale(saleId);
  }

  async listAudit(saleId: number) {
    await this.assertSale(saleId);
    return this.prisma.saleAuditLog.findMany({
      where: { saleId },
      orderBy: { changedAt: 'desc' },
      include: { changedBy: { select: { userId: true, email: true } } },
    });
  }

  async patchSalesStage(saleId: number, userId: number, dto: PatchSalesStageDto) {
    const sale = await this.assertSale(saleId);
    const sm = this.statusMap(sale.stageStatuses);
    const salesStatus = sm.get('SALES');
    if (
      salesStatus !== StageStatus.PENDING &&
      salesStatus !== StageStatus.IN_PROGRESS
    ) {
      throw new ForbiddenException('Sales stage is not editable in its current state');
    }

    if (dto.submitToAccounts) {
      const codes = await this.userPermissions.getPermissionCodesForUser(userId);
      if (!codes.has('sales.submit.accounts')) {
        throw new ForbiddenException('sales.submit.accounts is required to submit to accounts');
      }
    }

    const clientData: Prisma.SaleClientDetailsUncheckedUpdateInput = {};
    const clientKeys: (keyof PatchSalesStageDto)[] = [
      'clientCategoryId',
      'irNo',
      'fullName',
      'cnicNo',
      'phoneHome',
      'emailId',
      'address',
      'clientStatus',
      'cellNo',
      'fatherName',
      'phoneOffice',
      'companyDepartment',
      'addressLine2',
    ];
    for (const k of clientKeys) {
      const v = dto[k];
      if (v !== undefined) {
        (clientData as Record<string, unknown>)[k] = v;
      }
    }
    if (dto.dateOfBirth !== undefined) {
      clientData.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
    }

    const productData: Prisma.SaleProductDetailsUncheckedUpdateInput = {};
    if (dto.productId !== undefined) productData.productId = dto.productId;
    if (dto.saleAmount !== undefined) productData.saleAmount = this.toDec(dto.saleAmount);
    if (dto.saleType !== undefined) productData.saleType = dto.saleType;
    if (dto.packageId !== undefined) productData.packageId = dto.packageId;
    if (dto.renewalCharges !== undefined) {
      productData.renewalCharges = this.toDec(dto.renewalCharges);
    }
    if (dto.customTypeValue !== undefined) productData.customTypeValue = dto.customTypeValue;
    if (dto.salesRemarks !== undefined) productData.salesRemarks = dto.salesRemarks;

    return this.prisma.$transaction(async (tx) => {
      const prevClient = await tx.saleClientDetails.findUnique({ where: { saleId } });
      const prevProduct = await tx.saleProductDetails.findUnique({ where: { saleId } });

      if (Object.keys(clientData).length > 0) {
        await tx.saleClientDetails.upsert({
          where: { saleId },
          create: { saleId, ...clientData } as Prisma.SaleClientDetailsUncheckedCreateInput,
          update: clientData,
        });
        for (const [k, v] of Object.entries(clientData)) {
          await this.audit(tx, saleId, userId, 'SALES', `client.${k}`, prevClient?.[k as keyof typeof prevClient], v);
        }
      }

      if (Object.keys(productData).length > 0) {
        await tx.saleProductDetails.upsert({
          where: { saleId },
          create: { saleId, ...productData } as Prisma.SaleProductDetailsUncheckedCreateInput,
          update: productData,
        });
        for (const [k, v] of Object.entries(productData)) {
          await this.audit(
            tx,
            saleId,
            userId,
            'SALES',
            `product.${k}`,
            prevProduct?.[k as keyof typeof prevProduct],
            v,
          );
        }
      }

      if (dto.submitToAccounts) {
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'SALES' },
          data: { status: StageStatus.COMPLETED, updatedByUserId: userId },
        });
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'ACCOUNTS' },
          data: { status: StageStatus.IN_PROGRESS, updatedByUserId: userId },
        });
        await this.audit(tx, saleId, userId, 'SALES', 'workflow.submitToAccounts', null, true);
      }

      return tx.sale.findUniqueOrThrow({
        where: { saleId },
        include: this.saleInclude(),
      });
    });
  }

  private async assertAnyAccountsAccess(userId: number) {
    const codes = await this.userPermissions.getPermissionCodesForUser(userId);
    const ok = ['accounts.review', 'accounts.hold', 'accounts.approve', 'accounts.reject'].some((c) =>
      codes.has(c),
    );
    if (!ok) {
      throw new ForbiddenException('An accounts-stage permission is required');
    }
  }

  private async assertAccountsDecisionPermission(userId: number, decision: AccountsDecision) {
    const codes = await this.userPermissions.getPermissionCodesForUser(userId);
    if (decision === AccountsDecision.HOLD && !codes.has('accounts.hold')) {
      throw new ForbiddenException('accounts.hold required');
    }
    if (decision === AccountsDecision.APPROVED && !codes.has('accounts.approve')) {
      throw new ForbiddenException('accounts.approve required');
    }
    if (decision === AccountsDecision.REJECTED && !codes.has('accounts.reject')) {
      throw new ForbiddenException('accounts.reject required');
    }
    if (decision === AccountsDecision.CONTINUE && !codes.has('accounts.review')) {
      throw new ForbiddenException('accounts.review required for CONTINUE');
    }
  }

  async patchAccountsStage(saleId: number, userId: number, dto: PatchAccountsStageDto) {
    const sale = await this.assertSale(saleId);
    const sm = this.statusMap(sale.stageStatuses);

    if (sm.get('SALES') !== StageStatus.COMPLETED) {
      throw new ForbiddenException('Accounts stage opens only after sales stage is completed');
    }

    const acc = sm.get('ACCOUNTS');
    if (
      acc !== StageStatus.PENDING &&
      acc !== StageStatus.IN_PROGRESS &&
      acc !== StageStatus.HELD
    ) {
      throw new ForbiddenException('Accounts stage is not editable in its current state');
    }

    await this.assertAnyAccountsAccess(userId);
    if (dto.decision !== undefined) {
      await this.assertAccountsDecisionPermission(userId, dto.decision);
    }

    return this.prisma.$transaction(async (tx) => {
      const prev = await tx.saleAccountsReview.findUnique({ where: { saleId } });

      await tx.saleAccountsReview.upsert({
        where: { saleId },
        create: {
          saleId,
          accountsRemark: dto.accountsRemark,
          decision: dto.decision,
          reviewedByUserId: userId,
          reviewedAt: new Date(),
        },
        update: {
          accountsRemark: dto.accountsRemark ?? undefined,
          decision: dto.decision ?? undefined,
          reviewedByUserId: userId,
          reviewedAt: new Date(),
        },
      });

      if (dto.accountsRemark !== undefined) {
        await this.audit(tx, saleId, userId, 'ACCOUNTS', 'accountsRemark', prev?.accountsRemark, dto.accountsRemark);
      }
      if (dto.decision !== undefined) {
        await this.audit(tx, saleId, userId, 'ACCOUNTS', 'decision', prev?.decision, dto.decision);
      }

      if (dto.decision === AccountsDecision.REJECTED) {
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'ACCOUNTS' },
          data: { status: StageStatus.REJECTED, updatedByUserId: userId },
        });
        await tx.sale.update({ where: { saleId }, data: { isActive: false } });
      } else if (dto.decision === AccountsDecision.HOLD) {
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'ACCOUNTS' },
          data: { status: StageStatus.HELD, updatedByUserId: userId },
        });
      } else if (
        dto.decision === AccountsDecision.APPROVED ||
        dto.decision === AccountsDecision.CONTINUE
      ) {
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'ACCOUNTS' },
          data: { status: StageStatus.COMPLETED, updatedByUserId: userId },
        });
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'OPERATIONS' },
          data: { status: StageStatus.IN_PROGRESS, updatedByUserId: userId },
        });
      }

      return tx.sale.findUniqueOrThrow({
        where: { saleId },
        include: this.saleInclude(),
      });
    });
  }

  async patchOperationsStage(saleId: number, userId: number, dto: PatchOperationsStageDto) {
    const sale = await this.assertSale(saleId);
    const sm = this.statusMap(sale.stageStatuses);

    if (sm.get('ACCOUNTS') !== StageStatus.COMPLETED) {
      throw new ForbiddenException('Operations stage opens only after accounts approves');
    }

    const op = sm.get('OPERATIONS');
    if (op !== StageStatus.PENDING && op !== StageStatus.IN_PROGRESS) {
      throw new ForbiddenException('Operations stage is not editable in its current state');
    }

    if (dto.submitToTechnician) {
      const codes = await this.userPermissions.getPermissionCodesForUser(userId);
      if (!codes.has('operations.submit.technician')) {
        throw new ForbiddenException('operations.submit.technician is required');
      }
    }

    const data: Prisma.SaleOperationsAssignmentUncheckedUpdateInput = {};
    const assignKeys: (keyof PatchOperationsStageDto)[] = [
      'productId',
      'zoneId',
      'deviceComboId',
      'simId',
      'accessory1Id',
      'accessory2Id',
      'accessory3Id',
      'packageId',
      'assignedTechnicianUserId',
      'deviceId',
    ];
    let touchesAssignment = false;
    for (const k of assignKeys) {
      if (dto[k] !== undefined) {
        (data as Record<string, unknown>)[k] = dto[k];
        touchesAssignment = true;
      }
    }
    if (touchesAssignment) {
      data.assignedByUserId = userId;
      data.assignedAt = new Date();
    }

    return this.prisma.$transaction(async (tx) => {
      const prev = await tx.saleOperationsAssignment.findUnique({ where: { saleId } });

      if (Object.keys(data).length > 0) {
        await tx.saleOperationsAssignment.upsert({
          where: { saleId },
          create: { saleId, ...data } as Prisma.SaleOperationsAssignmentUncheckedCreateInput,
          update: data,
        });
        for (const [k, v] of Object.entries(data)) {
          await this.audit(
            tx,
            saleId,
            userId,
            'OPERATIONS',
            k,
            prev?.[k as keyof typeof prev],
            v,
          );
        }
      }

      if (dto.submitToTechnician) {
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'OPERATIONS' },
          data: { status: StageStatus.COMPLETED, updatedByUserId: userId },
        });
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'TECHNICIAN' },
          data: { status: StageStatus.IN_PROGRESS, updatedByUserId: userId },
        });
        await this.audit(tx, saleId, userId, 'OPERATIONS', 'workflow.submitToTechnician', null, true);
      }

      return tx.sale.findUniqueOrThrow({
        where: { saleId },
        include: this.saleInclude(),
      });
    });
  }

  async patchTechnicianStage(saleId: number, userId: number, dto: PatchTechnicianStageDto) {
    const sale = await this.assertSale(saleId);
    const sm = this.statusMap(sale.stageStatuses);

    if (sm.get('OPERATIONS') !== StageStatus.COMPLETED) {
      throw new ForbiddenException('Technician stage opens only after operations completes');
    }

    const tech = sm.get('TECHNICIAN');
    if (tech !== StageStatus.PENDING && tech !== StageStatus.IN_PROGRESS) {
      throw new ForbiddenException('Technician stage is not editable in its current state');
    }

    if (dto.markComplete) {
      const codes = await this.userPermissions.getPermissionCodesForUser(userId);
      if (!codes.has('technician.install.complete')) {
        throw new ForbiddenException('technician.install.complete is required to complete installation');
      }
    }

    const data: Prisma.SaleInstallationUncheckedUpdateInput = {
      installedByUserId: userId,
      installedAt: new Date(),
    };
    if (dto.installationDate !== undefined) {
      data.installationDate = dto.installationDate ? new Date(dto.installationDate) : null;
    }
    if (dto.renewalDate !== undefined) {
      data.renewalDate = dto.renewalDate ? new Date(dto.renewalDate) : null;
    }
    if (dto.registrationNo !== undefined) data.registrationNo = dto.registrationNo;
    if (dto.engineNo !== undefined) data.engineNo = dto.engineNo;
    if (dto.transmissionType !== undefined) data.transmissionType = dto.transmissionType;
    if (dto.chassisNo !== undefined) data.chassisNo = dto.chassisNo;
    if (dto.makeModel !== undefined) data.makeModel = dto.makeModel;
    if (dto.vehicleYear !== undefined) data.vehicleYear = dto.vehicleYear;
    if (dto.color !== undefined) data.color = dto.color;

    return this.prisma.$transaction(async (tx) => {
      const prev = await tx.saleInstallation.findUnique({ where: { saleId } });

      await tx.saleInstallation.upsert({
        where: { saleId },
        create: { saleId, ...data } as Prisma.SaleInstallationUncheckedCreateInput,
        update: data,
      });

      for (const [k, v] of Object.entries(data)) {
        if (k === 'installedByUserId' || k === 'installedAt') continue;
        await this.audit(tx, saleId, userId, 'TECHNICIAN', k, prev?.[k as keyof typeof prev], v);
      }

      if (dto.markComplete) {
        await tx.saleStageStatus.updateMany({
          where: { saleId, stageCode: 'TECHNICIAN' },
          data: { status: StageStatus.COMPLETED, updatedByUserId: userId },
        });
        await this.audit(tx, saleId, userId, 'TECHNICIAN', 'workflow.markComplete', null, true);
      }

      return tx.sale.findUniqueOrThrow({
        where: { saleId },
        include: this.saleInclude(),
      });
    });
  }
}
