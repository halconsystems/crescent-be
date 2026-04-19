import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { CreateItemDto, UpdateItemDto } from './dto/inventory.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory items')
@ApiBearerAuth(JWT_AUTH_BEARER)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/items')
export class InventoryItemsController {
  constructor(private readonly inventory: InventoryService) {}

  @Get()
  @RequirePermissions('inventory.items.view')
  @ApiOperation({ summary: 'List items' })
  findAll() {
    return this.inventory.listItems();
  }

  @Post()
  @RequirePermissions('inventory.items.create')
  @ApiOperation({ summary: 'Create item' })
  create(@Body() dto: CreateItemDto) {
    return this.inventory.createItem(dto);
  }

  @Get('search')
  @RequirePermissions('inventory.items.view')
  @ApiQuery({ name: 'q', required: false })
  search(@Query('q') q?: string) {
    return this.inventory.searchItems(q);
  }

  @Get('sku/:sku')
  @RequirePermissions('inventory.items.view')
  @ApiParam({ name: 'sku' })
  bySku(@Param('sku') sku: string) {
    return this.inventory.getItemBySku(sku);
  }

  @Get(':id')
  @RequirePermissions('inventory.items.view')
  @ApiParam({ name: 'id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.getItem(id);
  }

  @Put(':id')
  @RequirePermissions('inventory.items.edit')
  @ApiParam({ name: 'id' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemDto) {
    return this.inventory.updateItem(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('inventory.items.delete')
  @ApiParam({ name: 'id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventory.deleteItem(id);
  }

}
