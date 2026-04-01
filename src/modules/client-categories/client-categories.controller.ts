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
import { ClientCategoriesService } from './client-categories.service';
import { CreateClientCategoryDto } from './dto/create-client-category.dto';
import { UpdateClientCategoryDto } from './dto/update-client-category.dto';

@ApiTags('Client categories')
@Controller('api/v1/client-categories')
export class ClientCategoriesController {
  constructor(private readonly clientCategoriesService: ClientCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create client category' })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateClientCategoryDto) {
    return this.clientCategoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List client categories' })
  findAll() {
    return this.clientCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client category by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClientCategoryDto) {
    return this.clientCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientCategoriesService.remove(id);
  }
}
