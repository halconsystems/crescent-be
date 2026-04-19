import { BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  const prisma = {} as any;
  let service: InventoryService;

  beforeEach(() => {
    service = new InventoryService(prisma);
  });

  it('rejects transfer to same store', async () => {
    await expect(
      service.createTransfer(
        {
          fromStoreId: 1,
          toStoreId: 1,
          lines: [{ itemId: 1, qty: 1 }],
        },
        1,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects PO creation when PR is not approved', async () => {
    jest.spyOn(service as any, 'getPurchaseRequest').mockResolvedValue({ status: 'DRAFT' });
    await expect(
      service.createPurchaseOrder(
        {
          purchaseRequestId: 99,
          lines: [{ itemId: 1, qty: 1 }],
        },
        1,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
