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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { ClientCategoriesService } from './client-categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateClientCategoryDto } from './dto/create-client-category.dto';
import { UpdateClientCategoryDto } from './dto/update-client-category.dto';

@ApiTags('Client categories')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/client-categories')
@UseGuards(JwtAuthGuard)
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
