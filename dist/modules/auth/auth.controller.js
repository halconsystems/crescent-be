"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const logout_dto_1 = require("./dto/logout.dto");
const register_dto_1 = require("./dto/register.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    getRequestMeta(req) {
        var _a, _b;
        const forwardedFor = req.headers['x-forwarded-for'];
        const rawIp = Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : (_a = forwardedFor === null || forwardedFor === void 0 ? void 0 : forwardedFor.split(',')[0]) !== null && _a !== void 0 ? _a : req.ip;
        const ip = rawIp === null || rawIp === void 0 ? void 0 : rawIp.trim();
        return {
            userAgent: (_b = req.get('user-agent')) !== null && _b !== void 0 ? _b : null,
            ipv4: ip && ip.includes('.') ? ip : null,
            ipv6: ip && ip.includes(':') ? ip : null,
        };
    }
    async login(dto, req) {
        return this.authService.login(dto.email, dto.password, this.getRequestMeta(req));
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async refresh(dto, req) {
        return this.authService.refresh(dto.refreshToken, this.getRequestMeta(req));
    }
    async logout(dto) {
        return this.authService.logout(dto.refreshToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email/password and receive JWT access token' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'JWT access token returned' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid payload or credentials' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid email or password' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('auth/register'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Register user and return access/refresh tokens' }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Access token, refresh token, and user payload returned' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid payload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('auth/refresh'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token (rotates refresh token)' }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'New access token returned' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid payload' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('auth/logout'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke refresh token (logout)' }),
    (0, swagger_1.ApiBody)({ type: logout_dto_1.LogoutDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Refresh token revoked' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid payload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logout_dto_1.LogoutDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map