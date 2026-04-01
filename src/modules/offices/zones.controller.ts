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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@ApiTags('Zones')
@Controller('api/v1/zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @ApiOperation({ summary: 'Create zone' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateZoneDto) {
    return this.zonesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List zones (optional filter by officeId)' })
  @ApiQuery({ name: 'officeId', required: false, type: Number })
  findAll(@Query('officeId') officeId?: string) {
    const id = officeId ? parseInt(officeId, 10) : undefined;
    return this.zonesService.findAll(Number.isFinite(id as number) ? id : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get zone by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Zone not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zonesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update zone' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Zone not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateZoneDto) {
    return this.zonesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete zone' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Zone not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zonesService.remove(id);
  }
}
