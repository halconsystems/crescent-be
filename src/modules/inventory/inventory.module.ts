import { Module } from '@nestjs/common';
import { InventoryDashboardController } from './inventory-dashboard.controller';
import { InventoryItemsController } from './inventory-items.controller';
import { InventoryMovementsController } from './inventory-movements.controller';
import { InventoryProcurementController } from './inventory-procurement.controller';
import { InventoryReportsController } from './inventory-reports.controller';
import { InventorySetupController } from './inventory-setup.controller';
import { InventoryUtilityController } from './inventory-utility.controller';
import { InventoryService } from './inventory.service';

@Module({
  controllers: [
    InventorySetupController,
    InventoryItemsController,
    InventoryProcurementController,
    InventoryMovementsController,
    InventoryReportsController,
    InventoryUtilityController,
    InventoryDashboardController,
  ],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
