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
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { SimsService } from './sims.service';

@ApiTags('SIMs')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/sims')
@UseGuards(JwtAuthGuard)
export class SimsController {
  constructor(private readonly simsService: SimsService) {}

  @Post()
  @ApiOperation({ summary: 'Create SIM lookup' })
  create(@Body() dto: CreateSimDto) {
    return this.simsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List SIMs' })
  findAll() {
    return this.simsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SIM by id' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.simsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update SIM' })
  @ApiParam({ name: 'id' })
  patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSimDto) {
    return this.simsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete SIM' })
  @ApiParam({ name: 'id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.simsService.remove(id);
  }
}
