import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateClientDto } from './dto/create-client.dto';

@ApiTags('Clients')
@ApiBearerAuth(JWT_AUTH_BEARER)
@Controller('api/v1')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({ type: CreateClientDto, description: 'Client payload' })
  @ApiCreatedResponse({ description: 'Client created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @UseGuards(JwtAuthGuard)
  @Post('create-client')
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }
}