import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
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
}
