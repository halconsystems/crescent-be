import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { GuardSearchQueryDto } from './dto/inventory.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory utility')
@ApiBearerAuth(JWT_AUTH_BEARER)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1')
export class InventoryUtilityController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('dropdowns')
  @RequirePermissions('inventory.utility.view')
  @ApiQuery({ name: 'resources', required: false })
  dropdowns(@Query('resources') resources?: string) {
    return this.inventory.dropdowns(resources);
  }

  @Get('dropdown/stores')
  @RequirePermissions('inventory.utility.view')
  legacyStores() {
    return this.inventory.dropdowns('stores');
  }

  @Get('dropdown/items')
  @RequirePermissions('inventory.utility.view')
  legacyItems() {
    return this.inventory.dropdowns('items');
  }

  @Get('dropdown/vendors')
  @RequirePermissions('inventory.utility.view')
  legacyVendors() {
    return this.inventory.dropdowns('vendors');
  }

  @Get('dropdown/categories')
  @RequirePermissions('inventory.utility.view')
  legacyCategories() {
    return this.inventory.dropdowns('categories');
  }

  @Get('guards/search')
  @RequirePermissions('inventory.utility.view')
  @ApiOperation({ summary: 'Placeholder guard search for compatibility' })
  guardSearch(@Query() query: GuardSearchQueryDto) {
    return {
      service_no: query.service_no ?? null,
      rows: [],
      message: 'Guard search is not part of this bounded inventory context yet.',
    };
  }
}
