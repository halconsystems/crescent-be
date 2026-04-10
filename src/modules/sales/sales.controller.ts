import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { RequirePermissions } from '../../common/rbac/require-permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { PatchAccountsStageDto } from './dto/patch-accounts-stage.dto';
import { PatchOperationsStageDto } from './dto/patch-operations-stage.dto';
import { PatchSalesStageDto } from './dto/patch-sales-stage.dto';
import { PatchTechnicianStageDto } from './dto/patch-technician-stage.dto';
import { SalesService } from './sales.service';

type AuthedReq = { user: { userId: number; email: string } };

@ApiTags('Sales')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/sales')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @RequirePermissions('sales.create')
  @ApiOperation({ summary: 'Create sale shell and initial stage statuses' })
  @ApiCreatedResponse()
  create(@Req() req: AuthedReq) {
    return this.salesService.create(req.user.userId);
  }

  @Get()
  @RequirePermissions('sales.view')
  @ApiOperation({ summary: 'List active sales' })
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id/audit')
  @RequirePermissions('sales.audit.view')
  @ApiOperation({ summary: 'List audit log entries for a sale' })
  @ApiParam({ name: 'id' })
  listAudit(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.listAudit(id);
  }

  @Get(':id')
  @RequirePermissions('sales.view')
  @ApiOperation({ summary: 'Get sale with stage payloads' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.findOne(id);
  }

  @Patch(':id/sales-stage')
  @RequirePermissions('sales.edit.client', 'sales.edit.product')
  @ApiOperation({ summary: 'Upsert sales-stage client/product rows; optional submit to accounts' })
  @ApiParam({ name: 'id' })
  patchSalesStage(@Param('id', ParseIntPipe) id: number, @Req() req: AuthedReq, @Body() dto: PatchSalesStageDto) {
    return this.salesService.patchSalesStage(id, req.user.userId, dto);
  }

  @Patch(':id/accounts-stage')
  @RequirePermissions('accounts.review', 'accounts.hold', 'accounts.approve', 'accounts.reject')
  @ApiOperation({ summary: 'Upsert accounts review; transitions workflow on decision' })
  @ApiParam({ name: 'id' })
  patchAccounts(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthedReq,
    @Body() dto: PatchAccountsStageDto,
  ) {
    return this.salesService.patchAccountsStage(id, req.user.userId, dto);
  }

  @Patch(':id/operations-stage')
  @RequirePermissions('operations.assign.device', 'operations.assign.technician', 'operations.view')
  @ApiOperation({ summary: 'Upsert operations assignment; optional handoff to technician' })
  @ApiParam({ name: 'id' })
  patchOperations(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthedReq,
    @Body() dto: PatchOperationsStageDto,
  ) {
    return this.salesService.patchOperationsStage(id, req.user.userId, dto);
  }

  @Patch(':id/technician-stage')
  @RequirePermissions('technician.install.edit', 'technician.view')
  @ApiOperation({ summary: 'Upsert installation record; optional complete technician stage' })
  @ApiParam({ name: 'id' })
  patchTechnician(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthedReq,
    @Body() dto: PatchTechnicianStageDto,
  ) {
    return this.salesService.patchTechnicianStage(id, req.user.userId, dto);
  }
}
