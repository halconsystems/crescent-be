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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        var _a;
        return this.prisma.product.create({
            data: {
                productName: dto.productName,
                isActive: (_a = dto.isActive) !== null && _a !== void 0 ? _a : true,
            },
        });
    }
    findAll() {
        return this.prisma.product.findMany({ orderBy: { productId: 'asc' } });
    }
    async findOne(productId) {
        const row = await this.prisma.product.findUnique({ where: { productId } });
        if (!row)
            throw new common_1.NotFoundException(`Product ${productId} not found`);
        return row;
    }
    async update(productId, dto) {
        await this.findOne(productId);
        return this.prisma.product.update({ where: { productId }, data: dto });
    }
    async remove(productId) {
        await this.findOne(productId);
        return this.prisma.product.delete({ where: { productId } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map