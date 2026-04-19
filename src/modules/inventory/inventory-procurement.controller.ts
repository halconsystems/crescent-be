import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import {
  ApproveRejectDto,
  CreateGrnDto,
  CreatePurchaseOrderDto,
  CreatePurchaseRequestDto,
  UpdateGrnDto,
  UpdatePurchaseOrderDto,
  UpdatePurchaseRequestDto,
} from './dto/inventory.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { InventoryService } from './inventory.service';

type AuthedReq = { user: { userId: number; email: string } };

@ApiBearerAuth(JWT_AUTH_BEARER)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1')
export class InventoryProcurementController {
  constructor(private readonly inventory: InventoryService) {}

  @ApiTags('Inventory purchase requests')
  @Get('purchase-requests')
  @RequirePermissions('inventory.pr.view')
  listPurchaseRequests() {
    return this.inventory.listPurchaseRequests();
  }

  @ApiTags('Inventory purchase requests')
  @Post('purchase-requests')
  @RequirePermissions('inventory.pr.create')
  createPurchaseRequest(@Req() req: AuthedReq, @Body() dto: CreatePurchaseRequestDto) {
    return this.inventory.createPurchaseRequest(dto, req.user.userId);
  }

  @ApiTags('Inventory purchase requests')
  @Get('purchase-requests/:id')
  @ApiParam({ name: 'id' })
  @RequirePermissions('inventory.pr.view')
  getPurchaseRequest(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getPurchaseRequest(id);
  }

  @ApiTags('Inventory purchase requests')
  @Put('purchase-requests/:id')
  @ApiParam({ name: 'id' })
  @RequirePermissions('inventory.pr.edit')
  updatePurchaseRequest(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePurchaseRequestDto) {
    return this.inventory.updatePurchaseRequest(id, dto);
  }

  @ApiTags('Inventory purchase requests')
  @Delete('purchase-requests/:id')
  @ApiParam({ name: 'id' })
  @RequirePermissions('inventory.pr.delete')
  deletePurchaseRequest(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deletePurchaseRequest(id);
  }

  @ApiTags('Inventory purchase requests')
  @Post('purchase-requests/:id/approve')
  @ApiOperation({ summary: 'Approve purchase request' })
  @RequirePermissions('inventory.pr.approve')
  approvePurchaseRequest(@Param('id', ParseIntPipe) id: number, @Req() req: AuthedReq) {
    return this.inventory.approvePurchaseRequest(id, req.user.userId);
  }

  @ApiTags('Inventory purchase requests')
  @Post('purchase-requests/:id/reject')
  @ApiOperation({ summary: 'Reject purchase request' })
  @RequirePermissions('inventory.pr.reject')
  rejectPurchaseRequest(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthedReq,
    @Body() dto: ApproveRejectDto,
  ) {
    return this.inventory.rejectPurchaseRequest(id, req.user.userId, dto.reason);
  }

  @ApiTags('Inventory purchase orders')
  @Get('purchase-orders')
  @RequirePermissions('inventory.po.view')
  listPurchaseOrders() {
    return this.inventory.listPurchaseOrders();
  }

  @ApiTags('Inventory purchase orders')
  @Post('purchase-orders')
  @RequirePermissions('inventory.po.create')
  createPurchaseOrder(@Req() req: AuthedReq, @Body() dto: CreatePurchaseOrderDto) {
    return this.inventory.createPurchaseOrder(dto, req.user.userId);
  }

  @ApiTags('Inventory purchase orders')
  @Get('purchase-orders/:id')
  @RequirePermissions('inventory.po.view')
  getPurchaseOrder(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getPurchaseOrder(id);
  }

  @ApiTags('Inventory purchase orders')
  @Put('purchase-orders/:id')
  @RequirePermissions('inventory.po.edit')
  updatePurchaseOrder(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePurchaseOrderDto) {
    return this.inventory.updatePurchaseOrder(id, dto);
  }

  @ApiTags('Inventory purchase orders')
  @Delete('purchase-orders/:id')
  @RequirePermissions('inventory.po.delete')
  deletePurchaseOrder(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deletePurchaseOrder(id);
  }

  @ApiTags('Inventory purchase orders')
  @Post('purchase-orders/:id/approve')
  @RequirePermissions('inventory.po.approve')
  approvePurchaseOrder(@Param('id', ParseIntPipe) id: number, @Req() req: AuthedReq) {
    return this.inventory.approvePurchaseOrder(id, req.user.userId);
  }

  @ApiTags('Inventory purchase orders')
  @Post('purchase-orders/:id/reject')
  @RequirePermissions('inventory.po.reject')
  rejectPurchaseOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthedReq,
    @Body() dto: ApproveRejectDto,
  ) {
    return this.inventory.rejectPurchaseOrder(id, req.user.userId, dto.reason);
  }

  @ApiTags('Inventory grn')
  @Get('grn')
  @RequirePermissions('inventory.grn.view')
  listGrn() {
    return this.inventory.listGrn();
  }

  @ApiTags('Inventory grn')
  @Post('grn')
  @RequirePermissions('inventory.grn.create')
  createGrn(@Req() req: AuthedReq, @Body() dto: CreateGrnDto) {
    return this.inventory.createGrn(dto, req.user.userId);
  }

  @ApiTags('Inventory grn')
  @Get('grn/:id')
  @RequirePermissions('inventory.grn.view')
  getGrn(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getGrn(id);
  }

  @ApiTags('Inventory grn')
  @Put('grn/:id')
  @RequirePermissions('inventory.grn.edit')
  updateGrn(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGrnDto) {
    return this.inventory.updateGrn(id, dto);
  }

  @ApiTags('Inventory grn')
  @Delete('grn/:id')
  @RequirePermissions('inventory.grn.delete')
  deleteGrn(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteGrn(id);
  }

  @ApiTags('Inventory grn')
  @Post('grn/:id/confirm')
  @RequirePermissions('inventory.grn.confirm')
  confirmGrn(@Param('id', ParseIntPipe) id: number, @Req() req: AuthedReq) {
    return this.inventory.confirmGrn(id, req.user.userId);
  }

  @ApiTags('Inventory grn')
  @Get('grn/purchase-order/:poId')
  @RequirePermissions('inventory.grn.view')
  byPo(@Param('poId', ParseIntPipe) poId: number) {
    return this.inventory.getGrnByPurchaseOrder(poId);
  }
}
