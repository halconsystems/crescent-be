import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): import("@prisma/client").Prisma.Prisma__ProductClient<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        productName: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        productName: string;
    }[]>;
    findOne(id: number): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        productName: string;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        productName: string;
    }>;
    remove(id: number): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        productName: string;
    }>;
}
