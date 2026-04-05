import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppUsersController } from './app-users.controller';
import { AppUsersService } from './app-users.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret-change-me',
        signOptions: {
          // Match AuthModule defaults for consistency.
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '15m') as `${number}m` | `${number}d` | number,
        },
      }),
    }),
  ],
  controllers: [AppUsersController],
  providers: [AppUsersService],
})
export class AppUsersModule {}
