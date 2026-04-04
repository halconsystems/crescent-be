"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const database_module_1 = require("./database/database.module");
const clients_module_1 = require("./modules/clients/clients.module");
const offices_module_1 = require("./modules/offices/offices.module");
const products_module_1 = require("./modules/products/products.module");
const banks_module_1 = require("./modules/banks/banks.module");
const bank_accounts_module_1 = require("./modules/bank-accounts/bank-accounts.module");
const cities_module_1 = require("./modules/cities/cities.module");
const vendors_module_1 = require("./modules/vendors/vendors.module");
const roles_module_1 = require("./modules/roles/roles.module");
const employees_module_1 = require("./modules/employees/employees.module");
const app_users_module_1 = require("./modules/app-users/app-users.module");
const user_roles_module_1 = require("./modules/user-roles/user-roles.module");
const password_reset_tokens_module_1 = require("./modules/password-reset-tokens/password-reset-tokens.module");
const user_password_history_module_1 = require("./modules/user-password-history/user-password-history.module");
const user_sessions_module_1 = require("./modules/user-sessions/user-sessions.module");
const client_categories_module_1 = require("./modules/client-categories/client-categories.module");
const packages_module_1 = require("./modules/packages/packages.module");
const zone_employees_module_1 = require("./modules/zone-employees/zone-employees.module");
const auth_module_1 = require("./modules/auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
            database_module_1.DatabaseModule,
            clients_module_1.ClientsModule,
            offices_module_1.OfficesModule,
            products_module_1.ProductsModule,
            banks_module_1.BanksModule,
            bank_accounts_module_1.BankAccountsModule,
            cities_module_1.CitiesModule,
            vendors_module_1.VendorsModule,
            roles_module_1.RolesModule,
            employees_module_1.EmployeesModule,
            app_users_module_1.AppUsersModule,
            user_roles_module_1.UserRolesModule,
            password_reset_tokens_module_1.PasswordResetTokensModule,
            user_password_history_module_1.UserPasswordHistoryModule,
            user_sessions_module_1.UserSessionsModule,
            client_categories_module_1.ClientCategoriesModule,
            packages_module_1.PackagesModule,
            zone_employees_module_1.ZoneEmployeesModule,
            auth_module_1.AuthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map