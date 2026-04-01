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
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PasswordResetTokensService } from './password-reset-tokens.service';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password-reset-token.dto';

@ApiTags('Password reset tokens')
@Controller('api/v1/password-reset-tokens')
export class PasswordResetTokensController {
  constructor(private readonly passwordResetTokensService: PasswordResetTokensService) {}

  @Post()
  @ApiOperation({ summary: 'Create password reset token (token stored as SHA-256)' })
  @ApiBadRequestResponse()
  create(@Body() dto: CreatePasswordResetTokenDto) {
    return this.passwordResetTokensService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List tokens (optional filter by userId)' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  findAll(@Query('userId') userId?: string) {
    const id = userId ? parseInt(userId, 10) : undefined;
    return this.passwordResetTokensService.findAll(
      Number.isFinite(id as number) ? id : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get token row by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.passwordResetTokensService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update token row' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePasswordResetTokenDto) {
    return this.passwordResetTokensService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete token row' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.passwordResetTokensService.remove(id);
  }
}
