import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@ApiTags('Banks')
@Controller('api/v1/banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  @ApiOperation({ summary: 'Create bank' })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateBankDto) {
    return this.banksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List banks' })
  findAll() {
    return this.banksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bank by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.banksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bank' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBankDto) {
    return this.banksService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bank' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.banksService.remove(id);
  }
}
