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
import { BankAccountsService } from './bank-accounts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@ApiTags('Bank accounts')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1/bank-accounts')
@UseGuards(JwtAuthGuard)
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create bank account' })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateBankAccountDto) {
    return this.bankAccountsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List bank accounts (optional filter by bankId)' })
  @ApiQuery({ name: 'bankId', required: false, type: Number })
  findAll(@Query('bankId') bankId?: string) {
    const id = bankId ? parseInt(bankId, 10) : undefined;
    return this.bankAccountsService.findAll(Number.isFinite(id as number) ? id : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bank account by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bankAccountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bank account' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBankAccountDto) {
    return this.bankAccountsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bank account' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bankAccountsService.remove(id);
  }
}
