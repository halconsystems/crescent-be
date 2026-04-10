import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    createClient(createClientDto: CreateClientDto): Promise<any>;
}
