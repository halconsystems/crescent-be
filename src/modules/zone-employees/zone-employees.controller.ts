import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { ZoneEmployeesService } from './zone-employees.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateZoneEmployeeDto } from './dto/create-zone-employee.dto';
import { UpdateZoneEmployeeDto } from './dto/update-zone-employee.dto';

@ApiTags('Zone employees')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/zone-employees')
@UseGuards(JwtAuthGuard)
export class ZoneEmployeesController {
  constructor(private readonly zoneEmployeesService: ZoneEmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Assign employee to zone' })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  create(@Body() dto: CreateZoneEmployeeDto) {
    return this.zoneEmployeesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List assignments (optional filters)' })
  @ApiQuery({ name: 'zoneId', required: false, type: Number })
  @ApiQuery({ name: 'employeeId', required: false, type: Number })
  findAll(@Query('zoneId') zoneId?: string, @Query('employeeId') employeeId?: string) {
    const z = zoneId ? parseInt(zoneId, 10) : undefined;
    const e = employeeId ? parseInt(employeeId, 10) : undefined;
    return this.zoneEmployeesService.findAll(
      Number.isFinite(z as number) ? z : undefined,
      Number.isFinite(e as number) ? e : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneEmployeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assignment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateZoneEmployeeDto) {
    return this.zoneEmployeesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove assignment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zoneEmployeesService.remove(id);
  }
}
