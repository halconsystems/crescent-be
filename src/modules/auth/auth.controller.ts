import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegisterDto } from './dto/register.dto';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateAppUserDto } from './dto/update.dto';

@ApiTags('Auth', 'App users')
@Controller('api/v1')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  private getRequestMeta(req: Request) {
    const forwardedFor = req.headers['x-forwarded-for'];
    const rawIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0] ?? req.ip;
    const ip = rawIp?.trim();
    return {
      userAgent: req.get('user-agent') ?? null,
      ipv4: ip && ip.includes('.') ? ip : null,
      ipv6: ip && ip.includes(':') ? ip : null,
    };
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email/password and receive JWT access token' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'JWT access token returned' })
  @ApiBadRequestResponse({ description: 'Invalid payload or credentials' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto.email, dto.password, this.getRequestMeta(req));
  }

  @Post('auth/register')
  @ApiOperation({ summary: 'Register user and return access/refresh tokens' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'Access token, refresh token, and user payload returned' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token (rotates refresh token)' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'New access token returned' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refresh(dto.refreshToken, this.getRequestMeta(req));
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke refresh token (logout)' })
  @ApiBody({ type: LogoutDto })
  @ApiOkResponse({ description: 'Refresh token revoked' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Get('app-users')
  @ApiBearerAuth(JWT_AUTH_BEARER)
  @ApiOperation({ summary: 'List application users (password hash omitted)' })
  @UseGuards(JwtAuthGuard)
  findAllAppUsers() {
    return this.authService.listUsers();
  }

  @Get('app-users/:id')
  @ApiBearerAuth(JWT_AUTH_BEARER)
  @ApiOperation({ summary: 'Get application user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard)
  findOneAppUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUser(id);
  }

  @Patch('app-users/:id')
  @ApiBearerAuth(JWT_AUTH_BEARER)
  @ApiOperation({ summary: 'Update application user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard)
  updateAppUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppUserDto) {
    return this.authService.updateUser(id, dto);
  }

  @Delete('app-users/:id')
  @ApiBearerAuth(JWT_AUTH_BEARER)
  @ApiOperation({ summary: 'Delete application user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard)
  removeAppUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.removeUser(id);
  }
}
