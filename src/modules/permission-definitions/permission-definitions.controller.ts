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
import { CreatePermissionDefinitionDto } from './dto/create-permission-definition.dto';
import { UpdatePermissionDefinitionDto } from './dto/update-permission-definition.dto';
import { PermissionDefinitionsService } from './permission-definitions.service';

@ApiTags('Permissions')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/permissions')
@UseGuards(JwtAuthGuard)
export class PermissionDefinitionsController {
  constructor(private readonly permissionDefinitionsService: PermissionDefinitionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create permission definition' })
  create(@Body() dto: CreatePermissionDefinitionDto) {
    return this.permissionDefinitionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List permission definitions' })
  findAll() {
    return this.permissionDefinitionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by id' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionDefinitionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiParam({ name: 'id' })
  patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionDefinitionDto) {
    return this.permissionDefinitionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  @ApiParam({ name: 'id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionDefinitionsService.remove(id);
  }
}
