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
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermissionsService } from './role-permissions.service';

@ApiTags('Role permissions')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Grant permission to role' })
  create(@Body() dto: CreateRolePermissionDto) {
    return this.rolePermissionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List role-permission rows' })
  @ApiQuery({ name: 'roleId', required: false })
  @ApiQuery({ name: 'permissionId', required: false })
  findAll(
    @Query('roleId') roleId?: string,
    @Query('permissionId') permissionId?: string,
  ) {
    return this.rolePermissionsService.findAll(
      roleId != null ? parseInt(roleId, 10) : undefined,
      permissionId != null ? parseInt(permissionId, 10) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role-permission by id' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolePermissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role-permission link' })
  @ApiParam({ name: 'id' })
  patch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolePermissionDto) {
    return this.rolePermissionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke permission from role' })
  @ApiParam({ name: 'id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolePermissionsService.remove(id);
  }
}
