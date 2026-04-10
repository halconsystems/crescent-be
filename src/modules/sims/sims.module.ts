import { Module } from '@nestjs/common';
import { SimsController } from './sims.controller';
import { SimsService } from './sims.service';

@Module({
  controllers: [SimsController],
  providers: [SimsService],
})
export class SimsModule {}
