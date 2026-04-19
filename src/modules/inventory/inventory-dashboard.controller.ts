import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { BulkItemsDto } from './dto/inventory.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory dashboard')
@ApiBearerAuth(JWT_AUTH_BEARER)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1')
export class InventoryDashboardController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('dashboard/stats')
  @RequirePermissions('inventory.dashboard.view')
  stats() {
    return this.inventory.dashboardStats();
  }

  @Get('low-stock-items')
  @RequirePermissions('inventory.dashboard.lowstock')
  lowStock() {
    return this.inventory.lowStockItems();
  }

  @Get('out-of-stock-items')
  @RequirePermissions('inventory.dashboard.outofstock')
  outOfStock() {
    return this.inventory.outOfStockItems();
  }

  @Post('bulk/items')
  @RequirePermissions('inventory.items.bulk_create')
  bulkItems(@Body() dto: BulkItemsDto) {
    return Promise.all(dto.items.map((item) => this.inventory.createItem(item)));
  }
}
