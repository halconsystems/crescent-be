import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserPasswordHistoryService } from './user-password-history.service';
import { CreateUserPasswordHistoryDto } from './dto/create-user-password-history.dto';

@ApiTags('User password history')
@Controller('api/v1/user-password-history')
export class UserPasswordHistoryController {
  constructor(private readonly userPasswordHistoryService: UserPasswordHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Append password history entry (hash never listed)' })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateUserPasswordHistoryDto) {
    return this.userPasswordHistoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List history metadata (optional filter by userId)' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  findAll(@Query('userId') userId?: string) {
    const id = userId ? parseInt(userId, 10) : undefined;
    return this.userPasswordHistoryService.findAll(
      Number.isFinite(id as number) ? id : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get history row by id (no hash)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userPasswordHistoryService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete history row' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userPasswordHistoryService.remove(id);
  }
}
