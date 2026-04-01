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
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('User roles')
@Controller('api/v1/user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  create(@Body() dto: CreateUserRoleDto) {
    return this.userRolesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user-role rows (optional filters)' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'roleId', required: false, type: Number })
  findAll(@Query('userId') userId?: string, @Query('roleId') roleId?: string) {
    const uid = userId ? parseInt(userId, 10) : undefined;
    const rid = roleId ? parseInt(roleId, 10) : undefined;
    return this.userRolesService.findAll(
      Number.isFinite(uid as number) ? uid : undefined,
      Number.isFinite(rid as number) ? rid : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user-role by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userRolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user-role' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto) {
    return this.userRolesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user-role assignment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userRolesService.remove(id);
  }
}
