import { Module } from '@nestjs/common';
import { ZoneEmployeesController } from './zone-employees.controller';
import { ZoneEmployeesService } from './zone-employees.service';

@Module({
  controllers: [ZoneEmployeesController],
  providers: [ZoneEmployeesService],
})
export class ZoneEmployeesModule {}
