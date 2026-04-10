import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDefinitionDto } from './create-permission-definition.dto';

export class UpdatePermissionDefinitionDto extends PartialType(CreatePermissionDefinitionDto) {}
