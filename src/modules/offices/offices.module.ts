import { Module } from '@nestjs/common';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

@Module({
  controllers: [OfficesController, ZonesController],
  providers: [OfficesService, ZonesService],
})
export class OfficesModule {}
