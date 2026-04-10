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
import { AccessoriesService } from './accessories.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@ApiTags('Accessories')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/accessories')
@UseGuards(JwtAuthGuard)
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create accessory lookup' })
  create(@Body() dto: CreateAccessoryDto) {
    return this.accessoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List accessories' })
  findAll() {
    return this.accessoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get accessory by id' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accessoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update accessory' })
  @ApiParam({ name: 'id' })
  patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccessoryDto) {
    return this.accessoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete accessory' })
  @ApiParam({ name: 'id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accessoriesService.remove(id);
  }
}
