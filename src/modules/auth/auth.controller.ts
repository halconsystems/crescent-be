import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegisterDto } from './dto/register.dto';

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
  @ApiTags('Auth')
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
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Register user and return access/refresh tokens' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'Access token, refresh token, and user payload returned' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('auth/refresh')
  @ApiTags('Auth')
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
  @ApiTags('Auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke refresh token (logout)' })
  @ApiBody({ type: LogoutDto })
  @ApiOkResponse({ description: 'Refresh token revoked' })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }

}
