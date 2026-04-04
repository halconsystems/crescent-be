import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './modules/clients/clients.module';
import { OfficesModule } from './modules/offices/offices.module';
import { ProductsModule } from './modules/products/products.module';
import { BanksModule } from './modules/banks/banks.module';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module';
import { CitiesModule } from './modules/cities/cities.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { RolesModule } from './modules/roles/roles.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AppUsersModule } from './modules/app-users/app-users.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { PasswordResetTokensModule } from './modules/password-reset-tokens/password-reset-tokens.module';
import { UserPasswordHistoryModule } from './modules/user-password-history/user-password-history.module';
import { UserSessionsModule } from './modules/user-sessions/user-sessions.module';
import { ClientCategoriesModule } from './modules/client-categories/client-categories.module';
import { PackagesModule } from './modules/packages/packages.module';
import { ZoneEmployeesModule } from './modules/zone-employees/zone-employees.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 100,
        },
      ],
    }),
    DatabaseModule,
    ClientsModule,
    OfficesModule,
    ProductsModule,
    BanksModule,
    BankAccountsModule,
    CitiesModule,
    VendorsModule,
    RolesModule,
    EmployeesModule,
    AppUsersModule,
    UserRolesModule,
    PasswordResetTokensModule,
    UserPasswordHistoryModule,
    UserSessionsModule,
    ClientCategoriesModule,
    PackagesModule,
    ZoneEmployeesModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
