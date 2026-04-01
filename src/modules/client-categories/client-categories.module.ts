import { Module } from '@nestjs/common';
import { ClientCategoriesController } from './client-categories.controller';
import { ClientCategoriesService } from './client-categories.service';

@Module({
  controllers: [ClientCategoriesController],
  providers: [ClientCategoriesService],
})
export class ClientCategoriesModule {}
