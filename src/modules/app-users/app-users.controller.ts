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
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { AppUsersService } from './app-users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';

@ApiTags('App users')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/app-users')
@UseGuards(JwtAuthGuard)
export class AppUsersController {
  constructor(private readonly appUsersService: AppUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create application user (password is hashed; hash is never returned)' })
  @ApiBadRequestResponse()
  @ApiConflictResponse({ description: 'Username or employee already in use' })
  create(@Body() dto: CreateAppUserDto) {
    return this.appUsersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List application users (password hash omitted)' })
  findAll() {
    return this.appUsersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appUsersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update application user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppUserDto) {
    return this.appUsersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete application user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appUsersService.remove(id);
  }
}
