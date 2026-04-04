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
import { CitiesService } from './cities.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('Cities')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/cities')
@UseGuards(JwtAuthGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create city' })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateCityDto) {
    return this.citiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List cities' })
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update city' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCityDto) {
    return this.citiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete city' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.remove(id);
  }
}
