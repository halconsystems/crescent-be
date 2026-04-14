"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../../database/prisma.service");
const refresh_token_util_1 = require("./refresh-token.util");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    toPublic(user) {
        const { passwordHash: _p } = user, rest = __rest(user, ["passwordHash"]);
        return rest;
    }
    async validateUser(email, password) {
        const user = await this.prisma.appUser.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const ok = await argon2.verify(user.passwordHash, password);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.toPublic(user);
    }
    async register(dto) {
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.prisma.appUser.create({
            data: {
                email: dto.email,
                passwordHash,
                dob: new Date(dto.dob),
                cnic: dto.cnic,
                contactNo: dto.contactNo,
                address: dto.address,
            },
        });
        const accessToken = await this.jwtService.signAsync({
            sub: user.userId,
            email: user.email,
        });
        const { refreshToken } = await this.createRefreshToken(user.userId);
        return { accessToken, refreshToken, user: this.toPublic(user) };
    }
    async createRefreshToken(userId, meta) {
        var _a, _b, _c;
        const issuedAt = new Date();
        const refreshToken = (0, refresh_token_util_1.generateRefreshToken)();
        const tokenHash = (0, refresh_token_util_1.hashRefreshToken)(refreshToken);
        const record = await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                issuedAt,
                expiresAt: (0, refresh_token_util_1.getRefreshTokenExpiresAt)(issuedAt),
                userAgent: (_a = meta === null || meta === void 0 ? void 0 : meta.userAgent) !== null && _a !== void 0 ? _a : null,
                ipv4: (_b = meta === null || meta === void 0 ? void 0 : meta.ipv4) !== null && _b !== void 0 ? _b : null,
                ipv6: (_c = meta === null || meta === void 0 ? void 0 : meta.ipv6) !== null && _c !== void 0 ? _c : null,
            },
        });
        return { refreshToken, record };
    }
    async login(email, password, meta) {
        const user = await this.validateUser(email, password);
        const payload = { sub: user.userId, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);
        const { refreshToken } = await this.createRefreshToken(user.userId, meta);
        return {
            accessToken,
            refreshToken,
            user,
        };
    }
    async refresh(refreshToken, meta) {
        const tokenHash = (0, refresh_token_util_1.hashRefreshToken)(refreshToken);
        const existing = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
        if (!existing || existing.revokedAt || existing.expiresAt <= new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.prisma.appUser.findUnique({ where: { userId: existing.userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const now = new Date();
        const newRefreshToken = (0, refresh_token_util_1.generateRefreshToken)();
        await this.prisma.$transaction(async (tx) => {
            var _a, _b, _c;
            const created = await tx.refreshToken.create({
                data: {
                    userId: existing.userId,
                    tokenHash: (0, refresh_token_util_1.hashRefreshToken)(newRefreshToken),
                    issuedAt: now,
                    expiresAt: (0, refresh_token_util_1.getRefreshTokenExpiresAt)(now),
                    userAgent: (_a = meta === null || meta === void 0 ? void 0 : meta.userAgent) !== null && _a !== void 0 ? _a : null,
                    ipv4: (_b = meta === null || meta === void 0 ? void 0 : meta.ipv4) !== null && _b !== void 0 ? _b : null,
                    ipv6: (_c = meta === null || meta === void 0 ? void 0 : meta.ipv6) !== null && _c !== void 0 ? _c : null,
                },
            });
            await tx.refreshToken.update({
                where: { refreshTokenId: existing.refreshTokenId },
                data: {
                    revokedAt: now,
                    revokedReason: 'rotated',
                    replacedByTokenId: created.refreshTokenId,
                },
            });
        });
        const accessToken = await this.jwtService.signAsync({
            sub: user.userId,
            email: user.email,
        });
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(refreshToken) {
        const tokenHash = (0, refresh_token_util_1.hashRefreshToken)(refreshToken);
        const existing = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
        if (!existing || existing.revokedAt) {
            return { revoked: false };
        }
        await this.prisma.refreshToken.update({
            where: { refreshTokenId: existing.refreshTokenId },
            data: { revokedAt: new Date(), revokedReason: 'logout' },
        });
        return { revoked: true };
    }
    async verifyToken(token) {
        return this.jwtService.verifyAsync(token);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map