import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): import("@prisma/client").Prisma.Prisma__ProductClient<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }[]>;
    findOne(productId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }>;
    update(productId: number, dto: UpdateProductDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }>;
    remove(productId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }>;
}
