import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
export interface JwtPayload {
    sub: number;
    username: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        employeeId: number | null;
        isActive: boolean;
        userId: number;
        userName: string;
        isTempPassword: boolean;
        mustChangePassword: boolean;
        isEmailVerified: boolean;
        isMobileVerified: boolean;
        isLocked: boolean;
        failedLoginAttempts: number;
        lastLoginAt: Date | null;
        lastPasswordChangedAt: Date | null;
        createdByUserId: number | null;
    }>;
    login(username: string, password: string): Promise<{
        accessToken: string;
        user: {
            createdAt: Date;
            updatedAt: Date;
            employeeId: number | null;
            isActive: boolean;
            userId: number;
            userName: string;
            isTempPassword: boolean;
            mustChangePassword: boolean;
            isEmailVerified: boolean;
            isMobileVerified: boolean;
            isLocked: boolean;
            failedLoginAttempts: number;
            lastLoginAt: Date | null;
            lastPasswordChangedAt: Date | null;
            createdByUserId: number | null;
        };
    }>;
    verifyToken(token: string): Promise<JwtPayload>;
}
