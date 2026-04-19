"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const openapi_document_builder_1 = require("./swagger/openapi-document.builder");
function swaggerUiTagsSorter(a, b) {
    const ORDER = [
        'Auth',
        'Users',
        'Sales',
        'Inventory setup',
        'Inventory items',
        'Inventory purchase requests',
        'Inventory purchase orders',
        'Inventory grn',
        'Inventory movements',
        'Inventory reports',
        'Inventory utility',
        'Inventory dashboard',
        'Permissions',
        'Role permissions',
        'Roles',
        'User roles',
        'Employees',
        'Devices',
        'SIMs',
        'Device combos',
        'Accessories',
        'Offices',
        'Zones',
        'Zone employees',
        'Products',
        'Packages',
        'Client categories',
        'Banks',
        'Bank accounts',
        'Cities',
        'Vendors',
    ];
    const nameA = typeof a === 'string' ? a : (a && typeof a === 'object' && 'name' in a && typeof a.name === 'string' ? a.name : '');
    const nameB = typeof b === 'string' ? b : (b && typeof b === 'object' && 'name' in b && typeof b.name === 'string' ? b.name : '');
    const ia = ORDER.indexOf(nameA);
    const ib = ORDER.indexOf(nameB);
    if (ia === -1 && ib === -1)
        return nameA.localeCompare(nameB);
    if (ia === -1)
        return 1;
    if (ib === -1)
        return -1;
    return ia - ib;
}
async function bootstrap() {
    var _a, _b;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const isProduction = process.env.NODE_ENV === 'production';
    const corsOrigins = ((_b = (_a = process.env.CORS_ORIGIN) !== null && _a !== void 0 ? _a : process.env.FRONTEND_URL) !== null && _b !== void 0 ? _b : 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || corsOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`CORS blocked for origin: ${origin}`), false);
        },
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    if (!isProduction) {
        const expressApp = app.getHttpAdapter().getInstance();
        expressApp.use((req, res, next) => {
            var _a;
            const p = (_a = req.path) !== null && _a !== void 0 ? _a : '';
            if (p === '/api' || p.startsWith('/api/')) {
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }
            next();
        });
    }
    const document = swagger_1.SwaggerModule.createDocument(app, (0, openapi_document_builder_1.buildOpenApiDocument)());
    swagger_1.SwaggerModule.setup('api', app, document, Object.assign(Object.assign({}, (isProduction
        ? {}
        : {
            patchDocumentOnRequest: (_req, _res, _cached) => swagger_1.SwaggerModule.createDocument(app, (0, openapi_document_builder_1.buildOpenApiDocument)()),
        })), { swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: swaggerUiTagsSorter,
            operationsSorter: 'alpha',
        } }));
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map