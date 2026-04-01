import { PartialType } from '@nestjs/swagger';
import { CreateClientCategoryDto } from './create-client-category.dto';

export class UpdateClientCategoryDto extends PartialType(CreateClientCategoryDto) {}
