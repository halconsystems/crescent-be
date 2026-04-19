import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InvApprovalStatus,
  InvGrnStatus,
  InvMovementType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateCategoryDto,
  CreateGrnDto,
  CreateGroupDto,
  CreateIssuanceDto,
  CreateItemDto,
  CreatePurchaseOrderDto,
  CreatePurchaseRequestDto,
  CreateReturnDto,
  CreateStoreDto,
  CreateTransferDto,
  CreateVendorDto,
  InventoryCardQueryDto,
  ReportQueryDto,
  UpdateCategoryDto,
  UpdateGrnDto,
  UpdateGroupDto,
  UpdateIssuanceDto,
  UpdateItemDto,
  UpdatePurchaseOrderDto,
  UpdatePurchaseRequestDto,
  UpdateReturnDto,
  UpdateStoreDto,
  UpdateTransferDto,
  UpdateVendorDto,
} from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async nextCode(prefix: string, model: 'pr' | 'po' | 'grn' | 'iss' | 'ret' | 'trf') {
    const countMap = {
      pr: () => this.prisma.invPurchaseRequest.count(),
      po: () => this.prisma.invPurchaseOrder.count(),
      grn: () => this.prisma.invGrn.count(),
      iss: () => this.prisma.invIssuance.count(),
      ret: () => this.prisma.invReturn.count(),
      trf: () => this.prisma.invTransfer.count(),
    } as const;
    const count = await countMap[model]();
    return `${prefix}-${String(count + 1).padStart(6, '0')}`;
  }

  private async getStockBalance(itemId: number, storeId: number) {
    const sum = await this.prisma.invStockLedger.aggregate({
      where: { itemId, storeId },
      _sum: { qtyIn: true, qtyOut: true },
    });
    return (sum._sum.qtyIn ?? 0) - (sum._sum.qtyOut ?? 0);
  }

  private async ensureStock(itemId: number, storeId: number, qty: number) {
    const balance = await this.getStockBalance(itemId, storeId);
    if (balance < qty) {
      throw new BadRequestException(
        `Insufficient stock for item ${itemId} in store ${storeId}. Balance=${balance}, requested=${qty}`,
      );
    }
  }

  private toDate(value?: string) {
    return value ? new Date(value) : undefined;
  }

  private async writeLedgerRows(
    tx: Prisma.TransactionClient,
    args: Array<{
      movementType: InvMovementType;
      itemId: number;
      storeId: number;
      qtyIn?: number;
      qtyOut?: number;
      referenceType: string;
      referenceId: number;
      remarks?: string | null;
    }>,
  ) {
    if (!args.length) return;
    await tx.invStockLedger.createMany({
      data: args.map((a) => ({
        movementType: a.movementType,
        itemId: a.itemId,
        storeId: a.storeId,
        qtyIn: a.qtyIn ?? 0,
        qtyOut: a.qtyOut ?? 0,
        referenceType: a.referenceType,
        referenceId: a.referenceId,
        remarks: a.remarks ?? null,
      })),
    });
  }

  // setup - stores
  createStore(dto: CreateStoreDto) {
    return this.prisma.invStore.create({
      data: { storeName: dto.storeName, location: dto.location, isActive: dto.isActive ?? true },
    });
  }
  listStores() {
    return this.prisma.invStore.findMany({ orderBy: { storeId: 'asc' } });
  }
  async getStore(storeId: number) {
    const row = await this.prisma.invStore.findUnique({ where: { storeId } });
    if (!row) throw new NotFoundException(`Store ${storeId} not found`);
    return row;
  }
  async updateStore(storeId: number, dto: UpdateStoreDto) {
    await this.getStore(storeId);
    return this.prisma.invStore.update({ where: { storeId }, data: dto });
  }
  async deleteStore(storeId: number) {
    await this.getStore(storeId);
    return this.prisma.invStore.delete({ where: { storeId } });
  }

  // setup - categories
  createCategory(dto: CreateCategoryDto) {
    return this.prisma.invCategory.create({
      data: { categoryName: dto.categoryName, isActive: dto.isActive ?? true },
    });
  }
  listCategories() {
    return this.prisma.invCategory.findMany({ orderBy: { categoryId: 'asc' } });
  }
  async getCategory(categoryId: number) {
    const row = await this.prisma.invCategory.findUnique({ where: { categoryId } });
    if (!row) throw new NotFoundException(`Category ${categoryId} not found`);
    return row;
  }
  async updateCategory(categoryId: number, dto: UpdateCategoryDto) {
    await this.getCategory(categoryId);
    return this.prisma.invCategory.update({ where: { categoryId }, data: dto });
  }
  async deleteCategory(categoryId: number) {
    await this.getCategory(categoryId);
    return this.prisma.invCategory.delete({ where: { categoryId } });
  }

  // setup - groups
  createGroup(dto: CreateGroupDto) {
    return this.prisma.invGroup.create({
      data: {
        groupName: dto.groupName,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }
  listGroups() {
    return this.prisma.invGroup.findMany({ orderBy: { groupId: 'asc' } });
  }
  async getGroup(groupId: number) {
    const row = await this.prisma.invGroup.findUnique({ where: { groupId } });
    if (!row) throw new NotFoundException(`Group ${groupId} not found`);
    return row;
  }
  async updateGroup(groupId: number, dto: UpdateGroupDto) {
    await this.getGroup(groupId);
    return this.prisma.invGroup.update({ where: { groupId }, data: dto });
  }
  async deleteGroup(groupId: number) {
    await this.getGroup(groupId);
    return this.prisma.invGroup.delete({ where: { groupId } });
  }

  // setup - vendors
  createVendor(dto: CreateVendorDto) {
    return this.prisma.invVendor.create({
      data: {
        vendorName: dto.vendorName,
        contactPerson: dto.contactPerson,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        isActive: dto.isActive ?? true,
      },
    });
  }
  listVendors() {
    return this.prisma.invVendor.findMany({ orderBy: { vendorId: 'asc' } });
  }
  async getVendor(vendorId: number) {
    const row = await this.prisma.invVendor.findUnique({ where: { vendorId } });
    if (!row) throw new NotFoundException(`Vendor ${vendorId} not found`);
    return row;
  }
  async updateVendor(vendorId: number, dto: UpdateVendorDto) {
    await this.getVendor(vendorId);
    return this.prisma.invVendor.update({ where: { vendorId }, data: dto });
  }
  async deleteVendor(vendorId: number) {
    await this.getVendor(vendorId);
    return this.prisma.invVendor.delete({ where: { vendorId } });
  }

  // items
  createItem(dto: CreateItemDto) {
    return this.prisma.invItem.create({
      data: {
        sku: dto.sku,
        itemName: dto.itemName,
        categoryId: dto.categoryId,
        groupId: dto.groupId,
        defaultStoreId: dto.defaultStoreId,
        uom: dto.uom,
        reorderLevel: dto.reorderLevel ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }
  listItems() {
    return this.prisma.invItem.findMany({
      orderBy: { itemId: 'asc' },
      include: { category: true, group: true, defaultStore: true },
    });
  }
  async getItem(itemId: number) {
    const row = await this.prisma.invItem.findUnique({
      where: { itemId },
      include: { category: true, group: true, defaultStore: true },
    });
    if (!row) throw new NotFoundException(`Item ${itemId} not found`);
    return row;
  }
  async getItemBySku(sku: string) {
    const row = await this.prisma.invItem.findUnique({ where: { sku } });
    if (!row) throw new NotFoundException(`Item with SKU ${sku} not found`);
    return row;
  }
  searchItems(q?: string) {
    return this.prisma.invItem.findMany({
      where: q
        ? {
            OR: [
              { itemName: { contains: q, mode: 'insensitive' } },
              { sku: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { itemId: 'asc' },
    });
  }
  async updateItem(itemId: number, dto: UpdateItemDto) {
    await this.getItem(itemId);
    return this.prisma.invItem.update({ where: { itemId }, data: dto });
  }
  async deleteItem(itemId: number) {
    await this.getItem(itemId);
    return this.prisma.invItem.delete({ where: { itemId } });
  }

  // purchase requests
  createPurchaseRequest(dto: CreatePurchaseRequestDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const requestNo = await this.nextCode('PR', 'pr');
      const created = await tx.invPurchaseRequest.create({
        data: {
          requestNo,
          storeId: dto.storeId,
          remarks: dto.remarks,
          requestedByUserId: userId,
          lines: {
            create: dto.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, note: l.note })),
          },
        },
        include: { lines: true },
      });
      return created;
    });
  }
  listPurchaseRequests() {
    return this.prisma.invPurchaseRequest.findMany({
      include: { lines: true, store: true },
      orderBy: { purchaseRequestId: 'desc' },
    });
  }
  async getPurchaseRequest(purchaseRequestId: number) {
    const row = await this.prisma.invPurchaseRequest.findUnique({
      where: { purchaseRequestId },
      include: { lines: true, store: true },
    });
    if (!row) throw new NotFoundException(`Purchase request ${purchaseRequestId} not found`);
    return row;
  }
  async updatePurchaseRequest(purchaseRequestId: number, dto: UpdatePurchaseRequestDto) {
    await this.getPurchaseRequest(purchaseRequestId);
    return this.prisma.$transaction(async (tx) => {
      await tx.invPurchaseRequest.update({
        where: { purchaseRequestId },
        data: { storeId: dto.storeId, remarks: dto.remarks },
      });
      if (dto.lines?.length) {
        await tx.invPurchaseRequestLine.deleteMany({ where: { purchaseRequestId } });
        await tx.invPurchaseRequestLine.createMany({
          data: dto.lines.map((l) => ({ purchaseRequestId, itemId: l.itemId, qty: l.qty, note: l.note })),
        });
      }
      return tx.invPurchaseRequest.findUnique({
        where: { purchaseRequestId },
        include: { lines: true, store: true },
      });
    });
  }
  async deletePurchaseRequest(purchaseRequestId: number) {
    await this.getPurchaseRequest(purchaseRequestId);
    return this.prisma.invPurchaseRequest.delete({ where: { purchaseRequestId } });
  }
  async approvePurchaseRequest(purchaseRequestId: number, userId: number) {
    await this.getPurchaseRequest(purchaseRequestId);
    return this.prisma.invPurchaseRequest.update({
      where: { purchaseRequestId },
      data: { status: InvApprovalStatus.APPROVED, approvedAt: new Date(), approvedByUserId: userId },
    });
  }
  async rejectPurchaseRequest(purchaseRequestId: number, userId: number, reason?: string) {
    await this.getPurchaseRequest(purchaseRequestId);
    return this.prisma.invPurchaseRequest.update({
      where: { purchaseRequestId },
      data: {
        status: InvApprovalStatus.REJECTED,
        rejectedAt: new Date(),
        rejectedByUserId: userId,
        rejectionReason: reason,
      },
    });
  }

  // purchase orders
  async createPurchaseOrder(dto: CreatePurchaseOrderDto, userId: number) {
    if (dto.purchaseRequestId) {
      const pr = await this.getPurchaseRequest(dto.purchaseRequestId);
      if (pr.status !== InvApprovalStatus.APPROVED) {
        throw new BadRequestException('Only approved purchase requests can be converted into PO');
      }
    }
    return this.prisma.$transaction(async (tx) => {
      const poNo = await this.nextCode('PO', 'po');
      return tx.invPurchaseOrder.create({
        data: {
          poNo,
          purchaseRequestId: dto.purchaseRequestId,
          vendorId: dto.vendorId,
          storeId: dto.storeId,
          remarks: dto.remarks,
          orderedByUserId: userId,
          lines: { create: dto.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, note: l.note })) },
        },
        include: { lines: true },
      });
    });
  }
  listPurchaseOrders() {
    return this.prisma.invPurchaseOrder.findMany({
      include: { lines: true, vendor: true, store: true, purchaseRequest: true },
      orderBy: { purchaseOrderId: 'desc' },
    });
  }
  async getPurchaseOrder(purchaseOrderId: number) {
    const row = await this.prisma.invPurchaseOrder.findUnique({
      where: { purchaseOrderId },
      include: { lines: true, vendor: true, store: true, purchaseRequest: true },
    });
    if (!row) throw new NotFoundException(`Purchase order ${purchaseOrderId} not found`);
    return row;
  }
  async updatePurchaseOrder(purchaseOrderId: number, dto: UpdatePurchaseOrderDto) {
    await this.getPurchaseOrder(purchaseOrderId);
    return this.prisma.$transaction(async (tx) => {
      await tx.invPurchaseOrder.update({
        where: { purchaseOrderId },
        data: {
          purchaseRequestId: dto.purchaseRequestId,
          vendorId: dto.vendorId,
          storeId: dto.storeId,
          remarks: dto.remarks,
        },
      });
      if (dto.lines?.length) {
        await tx.invPurchaseOrderLine.deleteMany({ where: { purchaseOrderId } });
        await tx.invPurchaseOrderLine.createMany({
          data: dto.lines.map((l) => ({ purchaseOrderId, itemId: l.itemId, qty: l.qty, note: l.note })),
        });
      }
      return tx.invPurchaseOrder.findUnique({
        where: { purchaseOrderId },
        include: { lines: true, vendor: true, store: true, purchaseRequest: true },
      });
    });
  }
  async deletePurchaseOrder(purchaseOrderId: number) {
    await this.getPurchaseOrder(purchaseOrderId);
    return this.prisma.invPurchaseOrder.delete({ where: { purchaseOrderId } });
  }
  async approvePurchaseOrder(purchaseOrderId: number, userId: number) {
    await this.getPurchaseOrder(purchaseOrderId);
    return this.prisma.invPurchaseOrder.update({
      where: { purchaseOrderId },
      data: { status: InvApprovalStatus.APPROVED, approvedAt: new Date(), approvedByUserId: userId },
    });
  }
  async rejectPurchaseOrder(purchaseOrderId: number, userId: number, reason?: string) {
    await this.getPurchaseOrder(purchaseOrderId);
    return this.prisma.invPurchaseOrder.update({
      where: { purchaseOrderId },
      data: {
        status: InvApprovalStatus.REJECTED,
        rejectedAt: new Date(),
        rejectedByUserId: userId,
        rejectionReason: reason,
      },
    });
  }

  // GRN
  async createGrn(dto: CreateGrnDto, userId: number) {
    if (dto.purchaseOrderId) {
      const po = await this.getPurchaseOrder(dto.purchaseOrderId);
      if (po.status !== InvApprovalStatus.APPROVED) {
        throw new BadRequestException('Only approved PO can be received in GRN');
      }
    }
    return this.prisma.$transaction(async (tx) => {
      const grnNo = await this.nextCode('GRN', 'grn');
      return tx.invGrn.create({
        data: {
          grnNo,
          purchaseOrderId: dto.purchaseOrderId,
          storeId: dto.storeId,
          remarks: dto.remarks,
          receivedByUserId: userId,
          lines: { create: dto.lines.map((l) => ({ itemId: l.itemId, qtyReceived: l.qty, note: l.note })) },
        },
        include: { lines: true },
      });
    });
  }
  listGrn() {
    return this.prisma.invGrn.findMany({
      include: { lines: true, store: true, purchaseOrder: true },
      orderBy: { grnId: 'desc' },
    });
  }
  async getGrn(grnId: number) {
    const row = await this.prisma.invGrn.findUnique({
      where: { grnId },
      include: { lines: true, store: true, purchaseOrder: true },
    });
    if (!row) throw new NotFoundException(`GRN ${grnId} not found`);
    return row;
  }
  async updateGrn(grnId: number, dto: UpdateGrnDto) {
    const current = await this.getGrn(grnId);
    if (current.status === InvGrnStatus.CONFIRMED) {
      throw new BadRequestException('Confirmed GRN cannot be edited');
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.invGrn.update({
        where: { grnId },
        data: { purchaseOrderId: dto.purchaseOrderId, storeId: dto.storeId, remarks: dto.remarks },
      });
      if (dto.lines?.length) {
        await tx.invGrnLine.deleteMany({ where: { grnId } });
        await tx.invGrnLine.createMany({
          data: dto.lines.map((l) => ({ grnId, itemId: l.itemId, qtyReceived: l.qty, note: l.note })),
        });
      }
      return tx.invGrn.findUnique({ where: { grnId }, include: { lines: true, store: true, purchaseOrder: true } });
    });
  }
  async deleteGrn(grnId: number) {
    const current = await this.getGrn(grnId);
    if (current.status === InvGrnStatus.CONFIRMED) {
      throw new BadRequestException('Confirmed GRN cannot be deleted');
    }
    return this.prisma.invGrn.delete({ where: { grnId } });
  }
  async confirmGrn(grnId: number, userId: number) {
    const current = await this.getGrn(grnId);
    if (current.status === InvGrnStatus.CONFIRMED) return current;
    if (!current.storeId) throw new BadRequestException('GRN store is required before confirmation');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.invGrn.update({
        where: { grnId },
        data: { status: InvGrnStatus.CONFIRMED, confirmedAt: new Date(), confirmedByUserId: userId },
        include: { lines: true },
      });
      await this.writeLedgerRows(
        tx,
        updated.lines.map((l) => ({
          movementType: InvMovementType.GRN_IN,
          itemId: l.itemId,
          storeId: current.storeId!,
          qtyIn: l.qtyReceived,
          referenceType: 'GRN',
          referenceId: updated.grnId,
          remarks: current.remarks,
        })),
      );
      return this.getGrn(updated.grnId);
    });
  }
  getGrnByPurchaseOrder(poId: number) {
    return this.prisma.invGrn.findMany({ where: { purchaseOrderId: poId }, include: { lines: true } });
  }

  // movements
  async createIssuance(dto: CreateIssuanceDto, userId: number) {
    for (const line of dto.lines) {
      await this.ensureStock(line.itemId, dto.storeId, line.qty);
    }
    return this.prisma.$transaction(async (tx) => {
      const issuanceNo = await this.nextCode('ISS', 'iss');
      const created = await tx.invIssuance.create({
        data: {
          issuanceNo,
          storeId: dto.storeId,
          issuedTo: dto.issuedTo,
          remarks: dto.remarks,
          issuedByUserId: userId,
          lines: { create: dto.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, note: l.note })) },
        },
        include: { lines: true },
      });
      await this.writeLedgerRows(
        tx,
        created.lines.map((l) => ({
          movementType: InvMovementType.ISSUANCE_OUT,
          itemId: l.itemId,
          storeId: dto.storeId,
          qtyOut: l.qty,
          referenceType: 'ISSUANCE',
          referenceId: created.issuanceId,
          remarks: dto.remarks,
        })),
      );
      return created;
    });
  }
  listIssuance() {
    return this.prisma.invIssuance.findMany({ include: { lines: true, store: true }, orderBy: { issuanceId: 'desc' } });
  }
  async getIssuance(issuanceId: number) {
    const row = await this.prisma.invIssuance.findUnique({ where: { issuanceId }, include: { lines: true, store: true } });
    if (!row) throw new NotFoundException(`Issuance ${issuanceId} not found`);
    return row;
  }
  async updateIssuance(issuanceId: number, dto: UpdateIssuanceDto) {
    await this.getIssuance(issuanceId);
    return this.prisma.invIssuance.update({
      where: { issuanceId },
      data: { storeId: dto.storeId, issuedTo: dto.issuedTo, remarks: dto.remarks },
    });
  }
  async deleteIssuance(issuanceId: number) {
    await this.getIssuance(issuanceId);
    return this.prisma.invIssuance.delete({ where: { issuanceId } });
  }

  async createReturn(dto: CreateReturnDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const returnNo = await this.nextCode('RET', 'ret');
      const created = await tx.invReturn.create({
        data: {
          returnNo,
          storeId: dto.storeId,
          sourceReference: dto.sourceReference,
          remarks: dto.remarks,
          returnedByUserId: userId,
          lines: { create: dto.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, note: l.note })) },
        },
        include: { lines: true },
      });
      await this.writeLedgerRows(
        tx,
        created.lines.map((l) => ({
          movementType: InvMovementType.RETURN_IN,
          itemId: l.itemId,
          storeId: dto.storeId,
          qtyIn: l.qty,
          referenceType: 'RETURN',
          referenceId: created.returnId,
          remarks: dto.remarks,
        })),
      );
      return created;
    });
  }
  listReturns() {
    return this.prisma.invReturn.findMany({ include: { lines: true, store: true }, orderBy: { returnId: 'desc' } });
  }
  async getReturn(returnId: number) {
    const row = await this.prisma.invReturn.findUnique({ where: { returnId }, include: { lines: true, store: true } });
    if (!row) throw new NotFoundException(`Return ${returnId} not found`);
    return row;
  }
  async updateReturn(returnId: number, dto: UpdateReturnDto) {
    await this.getReturn(returnId);
    return this.prisma.invReturn.update({
      where: { returnId },
      data: { storeId: dto.storeId, sourceReference: dto.sourceReference, remarks: dto.remarks },
    });
  }
  async deleteReturn(returnId: number) {
    await this.getReturn(returnId);
    return this.prisma.invReturn.delete({ where: { returnId } });
  }

  async createTransfer(dto: CreateTransferDto, userId: number) {
    if (dto.fromStoreId === dto.toStoreId) {
      throw new BadRequestException('Transfer source and destination must be different stores');
    }
    for (const line of dto.lines) {
      await this.ensureStock(line.itemId, dto.fromStoreId, line.qty);
    }
    return this.prisma.$transaction(async (tx) => {
      const transferNo = await this.nextCode('TRF', 'trf');
      const created = await tx.invTransfer.create({
        data: {
          transferNo,
          fromStoreId: dto.fromStoreId,
          toStoreId: dto.toStoreId,
          remarks: dto.remarks,
          transferredByUserId: userId,
          lines: { create: dto.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, note: l.note })) },
        },
        include: { lines: true },
      });
      const rows = created.lines.flatMap((l) => [
        {
          movementType: InvMovementType.TRANSFER_OUT,
          itemId: l.itemId,
          storeId: dto.fromStoreId,
          qtyOut: l.qty,
          referenceType: 'TRANSFER',
          referenceId: created.transferId,
          remarks: dto.remarks,
        },
        {
          movementType: InvMovementType.TRANSFER_IN,
          itemId: l.itemId,
          storeId: dto.toStoreId,
          qtyIn: l.qty,
          referenceType: 'TRANSFER',
          referenceId: created.transferId,
          remarks: dto.remarks,
        },
      ]);
      await this.writeLedgerRows(tx, rows);
      return created;
    });
  }
  listTransfers() {
    return this.prisma.invTransfer.findMany({
      include: { lines: true, fromStore: true, toStore: true },
      orderBy: { transferId: 'desc' },
    });
  }
  async getTransfer(transferId: number) {
    const row = await this.prisma.invTransfer.findUnique({
      where: { transferId },
      include: { lines: true, fromStore: true, toStore: true },
    });
    if (!row) throw new NotFoundException(`Transfer ${transferId} not found`);
    return row;
  }
  async updateTransfer(transferId: number, dto: UpdateTransferDto) {
    await this.getTransfer(transferId);
    return this.prisma.invTransfer.update({
      where: { transferId },
      data: {
        fromStoreId: dto.fromStoreId,
        toStoreId: dto.toStoreId,
        remarks: dto.remarks,
      },
    });
  }
  async deleteTransfer(transferId: number) {
    await this.getTransfer(transferId);
    return this.prisma.invTransfer.delete({ where: { transferId } });
  }

  // reports and utility
  async inventoryCard(query: InventoryCardQueryDto) {
    const where: Prisma.InvStockLedgerWhereInput = {
      itemId: query.item_id,
      storeId: query.store_id,
      movementDate: {
        gte: this.toDate(query.date_from),
        lte: this.toDate(query.date_to),
      },
    };
    const [rows, sum] = await Promise.all([
      this.prisma.invStockLedger.findMany({
        where,
        include: { item: true, store: true },
        orderBy: { movementDate: 'desc' },
      }),
      this.prisma.invStockLedger.aggregate({
        where,
        _sum: { qtyIn: true, qtyOut: true },
      }),
    ]);
    return {
      balance: (sum._sum.qtyIn ?? 0) - (sum._sum.qtyOut ?? 0),
      totalIn: sum._sum.qtyIn ?? 0,
      totalOut: sum._sum.qtyOut ?? 0,
      rows,
    };
  }

  private dateWhere(query: ReportQueryDto): Prisma.DateTimeFilter {
    return {
      gte: this.toDate(query.date_from),
      lte: this.toDate(query.date_to),
    };
  }

  reportStock(query: ReportQueryDto) {
    return this.inventoryCard(query);
  }
  reportIssuance(query: ReportQueryDto) {
    return this.prisma.invIssuance.findMany({
      where: { storeId: query.store_id, createdAt: this.dateWhere(query) },
      include: { lines: true, store: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  reportReturns(query: ReportQueryDto) {
    return this.prisma.invReturn.findMany({
      where: { storeId: query.store_id, createdAt: this.dateWhere(query) },
      include: { lines: true, store: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  reportTransfers(query: ReportQueryDto) {
    return this.prisma.invTransfer.findMany({
      where: {
        OR: query.store_id
          ? [{ fromStoreId: query.store_id }, { toStoreId: query.store_id }]
          : undefined,
        createdAt: this.dateWhere(query),
      },
      include: { lines: true, fromStore: true, toStore: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  reportPurchase(query: ReportQueryDto) {
    return this.prisma.invPurchaseOrder.findMany({
      where: { storeId: query.store_id, createdAt: this.dateWhere(query) },
      include: { lines: true, vendor: true, store: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  overviewItems() {
    return this.listItems();
  }
  overviewPurchaseRequests() {
    return this.listPurchaseRequests();
  }

  async dropdowns(resources?: string) {
    const set = new Set((resources ?? '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean));
    const includeAll = set.size === 0;
    const result: Record<string, unknown> = {};
    if (includeAll || set.has('stores')) {
      result.stores = await this.prisma.invStore.findMany({ select: { storeId: true, storeName: true }, orderBy: { storeName: 'asc' } });
    }
    if (includeAll || set.has('items')) {
      result.items = await this.prisma.invItem.findMany({ select: { itemId: true, itemName: true, sku: true }, orderBy: { itemName: 'asc' } });
    }
    if (includeAll || set.has('vendors')) {
      result.vendors = await this.prisma.invVendor.findMany({ select: { vendorId: true, vendorName: true }, orderBy: { vendorName: 'asc' } });
    }
    if (includeAll || set.has('categories')) {
      result.categories = await this.prisma.invCategory.findMany({ select: { categoryId: true, categoryName: true }, orderBy: { categoryName: 'asc' } });
    }
    return result;
  }

  async dashboardStats() {
    const [items, stores, prs, pos, grn, issuance, returns, transfers] = await Promise.all([
      this.prisma.invItem.count(),
      this.prisma.invStore.count(),
      this.prisma.invPurchaseRequest.count(),
      this.prisma.invPurchaseOrder.count(),
      this.prisma.invGrn.count(),
      this.prisma.invIssuance.count(),
      this.prisma.invReturn.count(),
      this.prisma.invTransfer.count(),
    ]);
    return { items, stores, purchaseRequests: prs, purchaseOrders: pos, grn, issuance, returns, transfers };
  }

  async lowStockItems() {
    const items = await this.prisma.invItem.findMany({
      where: { isActive: true },
      select: { itemId: true, itemName: true, sku: true, reorderLevel: true, defaultStoreId: true },
    });
    const rows = await Promise.all(
      items.map(async (item) => {
        const storeId = item.defaultStoreId ?? 0;
        const balance = storeId ? await this.getStockBalance(item.itemId, storeId) : 0;
        return { ...item, balance };
      }),
    );
    return rows.filter((x) => x.balance <= x.reorderLevel);
  }

  async outOfStockItems() {
    const low = await this.lowStockItems();
    return low.filter((x) => x.balance <= 0);
  }
}
