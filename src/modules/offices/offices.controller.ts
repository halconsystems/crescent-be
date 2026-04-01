import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OfficesService } from './offices.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';

@ApiTags('Offices')
@Controller('api/v1/offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  @ApiOperation({ summary: 'Create office' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateOfficeDto) {
    return this.officesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List offices' })
  findAll() {
    return this.officesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get office by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Office not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.officesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update office' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Office not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOfficeDto) {
    return this.officesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete office' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse({ description: 'Office not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.officesService.remove(id);
  }
}
