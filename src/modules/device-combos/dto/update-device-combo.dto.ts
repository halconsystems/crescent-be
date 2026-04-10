import { PartialType } from '@nestjs/swagger';
import { CreateDeviceComboDto } from './create-device-combo.dto';

export class UpdateDeviceComboDto extends PartialType(CreateDeviceComboDto) {}
