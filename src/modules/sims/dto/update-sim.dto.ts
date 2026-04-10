import { PartialType } from '@nestjs/swagger';
import { CreateSimDto } from './create-sim.dto';

export class UpdateSimDto extends PartialType(CreateSimDto) {}
