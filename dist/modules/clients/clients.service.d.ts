import { PrismaService } from '../../database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
export declare class ClientsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClient(createClientDto: CreateClientDto): Promise<{
        name: string;
        cnic: string;
        email: string;
        irNo: string;
        phone: string;
        id: number;
    }>;
}
