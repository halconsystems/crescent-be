import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import {
  CreateCategoryDto,
  CreateGroupDto,
  CreateStoreDto,
  CreateVendorDto,
  UpdateCategoryDto,
  UpdateGroupDto,
  UpdateStoreDto,
  UpdateVendorDto,
} from './dto/inventory.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory setup')
@ApiBearerAuth(JWT_AUTH_BEARER)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1')
export class InventorySetupController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('stores')
  @RequirePermissions('inventory.stores.view')
  @ApiOperation({ summary: 'List stores' })
  listStores() {
    return this.inventory.listStores();
  }

  @Post('stores')
  @RequirePermissions('inventory.stores.create')
  @ApiOperation({ summary: 'Create store' })
  createStore(@Body() dto: CreateStoreDto) {
    return this.inventory.createStore(dto);
  }

  @Get('stores/:id')
  @RequirePermissions('inventory.stores.view')
  @ApiParam({ name: 'id' })
  getStore(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getStore(id);
  }

  @Put('stores/:id')
  @RequirePermissions('inventory.stores.edit')
  @ApiParam({ name: 'id' })
  updateStore(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStoreDto) {
    return this.inventory.updateStore(id, dto);
  }

  @Delete('stores/:id')
  @RequirePermissions('inventory.stores.delete')
  @ApiParam({ name: 'id' })
  deleteStore(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteStore(id);
  }

  @Get('categories')
  @RequirePermissions('inventory.categories.view')
  listCategories() {
    return this.inventory.listCategories();
  }

  @Post('categories')
  @RequirePermissions('inventory.categories.create')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.inventory.createCategory(dto);
  }

  @Get('categories/:id')
  @RequirePermissions('inventory.categories.view')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getCategory(id);
  }

  @Put('categories/:id')
  @RequirePermissions('inventory.categories.edit')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.inventory.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @RequirePermissions('inventory.categories.delete')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteCategory(id);
  }

  @Get('groups')
  @RequirePermissions('inventory.groups.view')
  listGroups() {
    return this.inventory.listGroups();
  }

  @Post('groups')
  @RequirePermissions('inventory.groups.create')
  createGroup(@Body() dto: CreateGroupDto) {
    return this.inventory.createGroup(dto);
  }

  @Get('groups/:id')
  @RequirePermissions('inventory.groups.view')
  getGroup(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getGroup(id);
  }

  @Put('groups/:id')
  @RequirePermissions('inventory.groups.edit')
  updateGroup(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGroupDto) {
    return this.inventory.updateGroup(id, dto);
  }

  @Delete('groups/:id')
  @RequirePermissions('inventory.groups.delete')
  deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteGroup(id);
  }

  @Get('inventory-vendors')
  @RequirePermissions('inventory.vendors.view')
  listVendors() {
    return this.inventory.listVendors();
  }

  @Post('inventory-vendors')
  @RequirePermissions('inventory.vendors.create')
  createVendor(@Body() dto: CreateVendorDto) {
    return this.inventory.createVendor(dto);
  }

  @Get('inventory-vendors/:id')
  @RequirePermissions('inventory.vendors.view')
  getVendor(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getVendor(id);
  }

  @Put('inventory-vendors/:id')
  @RequirePermissions('inventory.vendors.edit')
  updateVendor(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVendorDto) {
    return this.inventory.updateVendor(id, dto);
  }

  @Delete('inventory-vendors/:id')
  @RequirePermissions('inventory.vendors.delete')
  deleteVendor(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteVendor(id);
  }
}
