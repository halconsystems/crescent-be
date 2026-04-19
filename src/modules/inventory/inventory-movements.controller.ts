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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import {
  BulkIssuanceDto,
  CreateIssuanceDto,
  CreateReturnDto,
  CreateTransferDto,
  UpdateIssuanceDto,
  UpdateReturnDto,
  UpdateTransferDto,
} from './dto/inventory.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { InventoryService } from './inventory.service';

type AuthedReq = { user: { userId: number; email: string } };

@ApiTags('Inventory movements')
@ApiBearerAuth(JWT_AUTH_BEARER)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1')
export class InventoryMovementsController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('issuance')
  @RequirePermissions('inventory.issuance.view')
  listIssuance() {
    return this.inventory.listIssuance();
  }

  @Post('issuance')
  @RequirePermissions('inventory.issuance.create')
  createIssuance(@Req() req: AuthedReq, @Body() dto: CreateIssuanceDto) {
    return this.inventory.createIssuance(dto, req.user.userId);
  }

  @Get('issuance/:id')
  @RequirePermissions('inventory.issuance.view')
  getIssuance(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getIssuance(id);
  }

  @Put('issuance/:id')
  @RequirePermissions('inventory.issuance.edit')
  updateIssuance(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIssuanceDto) {
    return this.inventory.updateIssuance(id, dto);
  }

  @Delete('issuance/:id')
  @RequirePermissions('inventory.issuance.delete')
  deleteIssuance(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteIssuance(id);
  }

  @Post('bulk/issuance')
  @ApiTags('Inventory dashboard')
  @RequirePermissions('inventory.issuance.bulk_create')
  bulkIssuance(@Req() req: AuthedReq, @Body() dto: BulkIssuanceDto) {
    return Promise.all(dto.issuances.map((i) => this.inventory.createIssuance(i, req.user.userId)));
  }

  @Get('returns')
  @RequirePermissions('inventory.returns.view')
  listReturns() {
    return this.inventory.listReturns();
  }

  @Post('returns')
  @RequirePermissions('inventory.returns.create')
  createReturn(@Req() req: AuthedReq, @Body() dto: CreateReturnDto) {
    return this.inventory.createReturn(dto, req.user.userId);
  }

  @Get('returns/:id')
  @RequirePermissions('inventory.returns.view')
  getReturn(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getReturn(id);
  }

  @Put('returns/:id')
  @RequirePermissions('inventory.returns.edit')
  updateReturn(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReturnDto) {
    return this.inventory.updateReturn(id, dto);
  }

  @Delete('returns/:id')
  @RequirePermissions('inventory.returns.delete')
  deleteReturn(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteReturn(id);
  }

  @Get('transfers')
  @RequirePermissions('inventory.transfers.view')
  listTransfers() {
    return this.inventory.listTransfers();
  }

  @Post('transfers')
  @RequirePermissions('inventory.transfers.create')
  createTransfer(@Req() req: AuthedReq, @Body() dto: CreateTransferDto) {
    return this.inventory.createTransfer(dto, req.user.userId);
  }

  @Get('transfers/:id')
  @RequirePermissions('inventory.transfers.view')
  getTransfer(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getTransfer(id);
  }

  @Put('transfers/:id')
  @RequirePermissions('inventory.transfers.edit')
  updateTransfer(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransferDto) {
    return this.inventory.updateTransfer(id, dto);
  }

  @Delete('transfers/:id')
  @RequirePermissions('inventory.transfers.delete')
  deleteTransfer(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteTransfer(id);
  }
}
