import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    findOne(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }>;
    remove(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        productName: string;
        productId: number;
    }>;
}
