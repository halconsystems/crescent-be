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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { UserSessionsService } from './user-sessions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';

@ApiTags('User sessions')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/user-sessions')
@UseGuards(JwtAuthGuard)
export class UserSessionsController {
  constructor(private readonly userSessionsService: UserSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create session (refresh token stored as hash)' })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateUserSessionDto) {
    return this.userSessionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List sessions (optional filter by userId)' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  findAll(@Query('userId') userId?: string) {
    const id = userId ? parseInt(userId, 10) : undefined;
    return this.userSessionsService.findAll(Number.isFinite(id as number) ? id : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update session' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserSessionDto) {
    return this.userSessionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete session' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userSessionsService.remove(id);
  }
}
