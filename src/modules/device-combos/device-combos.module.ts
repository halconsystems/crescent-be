import { Module } from '@nestjs/common';
import { DeviceCombosController } from './device-combos.controller';
import { DeviceCombosService } from './device-combos.service';

@Module({
  controllers: [DeviceCombosController],
  providers: [DeviceCombosService],
})
export class DeviceCombosModule {}
