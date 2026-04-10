import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDeviceComboDto } from './dto/create-device-combo.dto';
import { UpdateDeviceComboDto } from './dto/update-device-combo.dto';
import { DeviceCombosService } from './device-combos.service';

@ApiTags('Device combos')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/device-combos')
@UseGuards(JwtAuthGuard)
export class DeviceCombosController {
  constructor(private readonly deviceCombosService: DeviceCombosService) {}

  @Post()
  @ApiOperation({ summary: 'Create device combo lookup' })
  create(@Body() dto: CreateDeviceComboDto) {
    return this.deviceCombosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List device combos' })
  findAll() {
    return this.deviceCombosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device combo by id' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deviceCombosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update device combo' })
  @ApiParam({ name: 'id' })
  patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeviceComboDto) {
    return this.deviceCombosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete device combo' })
  @ApiParam({ name: 'id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deviceCombosService.remove(id);
  }
}
