import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { InventoryCardQueryDto, ReportQueryDto } from './dto/inventory.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { InventoryService } from './inventory.service';

@ApiBearerAuth(JWT_AUTH_BEARER)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1')
export class InventoryReportsController {
  constructor(private readonly inventory: InventoryService) {}

  @ApiTags('Inventory reports')
  @Get('inventory-card')
  @RequirePermissions('inventory.stock.view')
  inventoryCard(@Query() query: InventoryCardQueryDto) {
    return this.inventory.inventoryCard(query);
  }

  @ApiTags('Inventory reports')
  @Get('reports/stock')
  @RequirePermissions('inventory.reports.stock')
  reportStock(@Query() query: ReportQueryDto) {
    return this.inventory.reportStock(query);
  }

  @ApiTags('Inventory reports')
  @Get('reports/issuance')
  @RequirePermissions('inventory.reports.issuance')
  reportIssuance(@Query() query: ReportQueryDto) {
    return this.inventory.reportIssuance(query);
  }

  @ApiTags('Inventory reports')
  @Get('reports/returns')
  @RequirePermissions('inventory.reports.returns')
  reportReturns(@Query() query: ReportQueryDto) {
    return this.inventory.reportReturns(query);
  }

  @ApiTags('Inventory reports')
  @Get('reports/transfers')
  @RequirePermissions('inventory.reports.transfers')
  reportTransfers(@Query() query: ReportQueryDto) {
    return this.inventory.reportTransfers(query);
  }

  @ApiTags('Inventory reports')
  @Get('reports/purchase')
  @RequirePermissions('inventory.reports.purchase')
  reportPurchase(@Query() query: ReportQueryDto) {
    return this.inventory.reportPurchase(query);
  }

  @ApiTags('Inventory items')
  @Get('overview/items')
  @RequirePermissions('inventory.items.view')
  overviewItems() {
    return this.inventory.overviewItems();
  }

  @ApiTags('Inventory purchase requests')
  @Get('overview/purchase-requests')
  @RequirePermissions('inventory.pr.view')
  overviewPurchaseRequests() {
    return this.inventory.overviewPurchaseRequests();
  }
}
