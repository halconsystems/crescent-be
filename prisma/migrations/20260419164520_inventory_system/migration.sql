-- CreateEnum
CREATE TYPE "InvApprovalStatus" AS ENUM ('DRAFT', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvGrnStatus" AS ENUM ('DRAFT', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "InvMovementType" AS ENUM ('GRN_IN', 'ISSUANCE_OUT', 'RETURN_IN', 'TRANSFER_OUT', 'TRANSFER_IN');

-- CreateTable
CREATE TABLE "InvStore" (
    "StoreID" SERIAL NOT NULL,
    "StoreName" TEXT NOT NULL,
    "Location" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvStore_pkey" PRIMARY KEY ("StoreID")
);

-- CreateTable
CREATE TABLE "InvCategory" (
    "CategoryID" SERIAL NOT NULL,
    "CategoryName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvCategory_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "InvGroup" (
    "GroupID" SERIAL NOT NULL,
    "GroupName" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvGroup_pkey" PRIMARY KEY ("GroupID")
);

-- CreateTable
CREATE TABLE "InvVendor" (
    "VendorID" SERIAL NOT NULL,
    "VendorName" TEXT NOT NULL,
    "ContactPerson" TEXT,
    "Phone" TEXT,
    "Email" TEXT,
    "Address" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvVendor_pkey" PRIMARY KEY ("VendorID")
);

-- CreateTable
CREATE TABLE "InvItem" (
    "ItemID" SERIAL NOT NULL,
    "SKU" TEXT NOT NULL,
    "ItemName" TEXT NOT NULL,
    "CategoryID" INTEGER,
    "GroupID" INTEGER,
    "DefaultStoreID" INTEGER,
    "UOM" TEXT,
    "ReorderLevel" INTEGER NOT NULL DEFAULT 0,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvItem_pkey" PRIMARY KEY ("ItemID")
);

-- CreateTable
CREATE TABLE "InvPurchaseRequest" (
    "PurchaseRequestID" SERIAL NOT NULL,
    "RequestNo" TEXT NOT NULL,
    "StoreID" INTEGER,
    "Status" "InvApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "Remarks" TEXT,
    "RequestedByUserID" INTEGER,
    "ApprovedByUserID" INTEGER,
    "ApprovedAt" TIMESTAMP(3),
    "RejectedByUserID" INTEGER,
    "RejectedAt" TIMESTAMP(3),
    "RejectionReason" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvPurchaseRequest_pkey" PRIMARY KEY ("PurchaseRequestID")
);

-- CreateTable
CREATE TABLE "InvPurchaseRequestLine" (
    "PurchaseRequestLineID" SERIAL NOT NULL,
    "PurchaseRequestID" INTEGER NOT NULL,
    "ItemID" INTEGER NOT NULL,
    "Qty" INTEGER NOT NULL,
    "Note" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvPurchaseRequestLine_pkey" PRIMARY KEY ("PurchaseRequestLineID")
);

-- CreateTable
CREATE TABLE "InvPurchaseOrder" (
    "PurchaseOrderID" SERIAL NOT NULL,
    "PONo" TEXT NOT NULL,
    "PurchaseRequestID" INTEGER,
    "VendorID" INTEGER,
    "StoreID" INTEGER,
    "Status" "InvApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "OrderedByUserID" INTEGER,
    "ApprovedByUserID" INTEGER,
    "ApprovedAt" TIMESTAMP(3),
    "RejectedByUserID" INTEGER,
    "RejectedAt" TIMESTAMP(3),
    "RejectionReason" TEXT,
    "Remarks" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvPurchaseOrder_pkey" PRIMARY KEY ("PurchaseOrderID")
);

-- CreateTable
CREATE TABLE "InvPurchaseOrderLine" (
    "PurchaseOrderLineID" SERIAL NOT NULL,
    "PurchaseOrderID" INTEGER NOT NULL,
    "ItemID" INTEGER NOT NULL,
    "Qty" INTEGER NOT NULL,
    "UnitPrice" DECIMAL(12,2),
    "Note" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvPurchaseOrderLine_pkey" PRIMARY KEY ("PurchaseOrderLineID")
);

-- CreateTable
CREATE TABLE "InvGRN" (
    "GRNID" SERIAL NOT NULL,
    "GRNNo" TEXT NOT NULL,
    "PurchaseOrderID" INTEGER,
    "StoreID" INTEGER,
    "Status" "InvGrnStatus" NOT NULL DEFAULT 'DRAFT',
    "ReceivedByUserID" INTEGER,
    "ConfirmedByUserID" INTEGER,
    "ConfirmedAt" TIMESTAMP(3),
    "Remarks" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvGRN_pkey" PRIMARY KEY ("GRNID")
);

-- CreateTable
CREATE TABLE "InvGRNLine" (
    "GRNLineID" SERIAL NOT NULL,
    "GRNID" INTEGER NOT NULL,
    "ItemID" INTEGER NOT NULL,
    "QtyReceived" INTEGER NOT NULL,
    "Note" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvGRNLine_pkey" PRIMARY KEY ("GRNLineID")
);

-- CreateTable
CREATE TABLE "InvIssuance" (
    "IssuanceID" SERIAL NOT NULL,
    "IssuanceNo" TEXT NOT NULL,
    "StoreID" INTEGER NOT NULL,
    "IssuedTo" TEXT,
    "Remarks" TEXT,
    "IssuedByUserID" INTEGER,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvIssuance_pkey" PRIMARY KEY ("IssuanceID")
);

-- CreateTable
CREATE TABLE "InvIssuanceLine" (
    "IssuanceLineID" SERIAL NOT NULL,
    "IssuanceID" INTEGER NOT NULL,
    "ItemID" INTEGER NOT NULL,
    "Qty" INTEGER NOT NULL,
    "Note" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvIssuanceLine_pkey" PRIMARY KEY ("IssuanceLineID")
);

-- CreateTable
CREATE TABLE "InvReturn" (
    "ReturnID" SERIAL NOT NULL,
    "ReturnNo" TEXT NOT NULL,
    "StoreID" INTEGER NOT NULL,
    "SourceReference" TEXT,
    "Remarks" TEXT,
    "ReturnedByUserID" INTEGER,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvReturn_pkey" PRIMARY KEY ("ReturnID")
);

-- CreateTable
CREATE TABLE "InvReturnLine" (
    "ReturnLineID" SERIAL NOT NULL,
    "ReturnID" INTEGER NOT NULL,
    "ItemID" INTEGER NOT NULL,
    "Qty" INTEGER NOT NULL,
    "Note" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvReturnLine_pkey" PRIMARY KEY ("ReturnLineID")
);

-- CreateTable
CREATE TABLE "InvTransfer" (
    "TransferID" SERIAL NOT NULL,
    "TransferNo" TEXT NOT NULL,
    "FromStoreID" INTEGER NOT NULL,
    "ToStoreID" INTEGER NOT NULL,
    "Remarks" TEXT,
    "TransferredByUserID" INTEGER,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvTransfer_pkey" PRIMARY KEY ("TransferID")
);

-- CreateTable
CREATE TABLE "InvTransferLine" (
    "TransferLineID" SERIAL NOT NULL,
    "TransferID" INTEGER NOT NULL,
    "ItemID" INTEGER NOT NULL,
    "Qty" INTEGER NOT NULL,
    "Note" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvTransferLine_pkey" PRIMARY KEY ("TransferLineID")
);

-- CreateTable
CREATE TABLE "InvStockLedger" (
    "StockLedgerID" SERIAL NOT NULL,
    "MovementType" "InvMovementType" NOT NULL,
    "ItemID" INTEGER NOT NULL,
    "StoreID" INTEGER NOT NULL,
    "QtyIn" INTEGER NOT NULL DEFAULT 0,
    "QtyOut" INTEGER NOT NULL DEFAULT 0,
    "MovementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ReferenceType" TEXT NOT NULL,
    "ReferenceID" INTEGER NOT NULL,
    "Remarks" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvStockLedger_pkey" PRIMARY KEY ("StockLedgerID")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvStore_StoreName_key" ON "InvStore"("StoreName");

-- CreateIndex
CREATE UNIQUE INDEX "InvCategory_CategoryName_key" ON "InvCategory"("CategoryName");

-- CreateIndex
CREATE UNIQUE INDEX "InvGroup_GroupName_key" ON "InvGroup"("GroupName");

-- CreateIndex
CREATE UNIQUE INDEX "InvVendor_VendorName_key" ON "InvVendor"("VendorName");

-- CreateIndex
CREATE UNIQUE INDEX "InvItem_SKU_key" ON "InvItem"("SKU");

-- CreateIndex
CREATE INDEX "InvItem_ItemName_idx" ON "InvItem"("ItemName");

-- CreateIndex
CREATE INDEX "InvItem_CategoryID_idx" ON "InvItem"("CategoryID");

-- CreateIndex
CREATE INDEX "InvItem_DefaultStoreID_idx" ON "InvItem"("DefaultStoreID");

-- CreateIndex
CREATE UNIQUE INDEX "InvPurchaseRequest_RequestNo_key" ON "InvPurchaseRequest"("RequestNo");

-- CreateIndex
CREATE INDEX "InvPurchaseRequest_Status_idx" ON "InvPurchaseRequest"("Status");

-- CreateIndex
CREATE INDEX "InvPurchaseRequest_CreatedAt_idx" ON "InvPurchaseRequest"("CreatedAt");

-- CreateIndex
CREATE INDEX "InvPurchaseRequestLine_ItemID_idx" ON "InvPurchaseRequestLine"("ItemID");

-- CreateIndex
CREATE UNIQUE INDEX "InvPurchaseOrder_PONo_key" ON "InvPurchaseOrder"("PONo");

-- CreateIndex
CREATE INDEX "InvPurchaseOrder_Status_idx" ON "InvPurchaseOrder"("Status");

-- CreateIndex
CREATE INDEX "InvPurchaseOrder_CreatedAt_idx" ON "InvPurchaseOrder"("CreatedAt");

-- CreateIndex
CREATE INDEX "InvPurchaseOrderLine_ItemID_idx" ON "InvPurchaseOrderLine"("ItemID");

-- CreateIndex
CREATE UNIQUE INDEX "InvGRN_GRNNo_key" ON "InvGRN"("GRNNo");

-- CreateIndex
CREATE INDEX "InvGRN_Status_idx" ON "InvGRN"("Status");

-- CreateIndex
CREATE INDEX "InvGRN_CreatedAt_idx" ON "InvGRN"("CreatedAt");

-- CreateIndex
CREATE INDEX "InvGRNLine_ItemID_idx" ON "InvGRNLine"("ItemID");

-- CreateIndex
CREATE UNIQUE INDEX "InvIssuance_IssuanceNo_key" ON "InvIssuance"("IssuanceNo");

-- CreateIndex
CREATE INDEX "InvIssuance_CreatedAt_idx" ON "InvIssuance"("CreatedAt");

-- CreateIndex
CREATE INDEX "InvIssuanceLine_ItemID_idx" ON "InvIssuanceLine"("ItemID");

-- CreateIndex
CREATE UNIQUE INDEX "InvReturn_ReturnNo_key" ON "InvReturn"("ReturnNo");

-- CreateIndex
CREATE INDEX "InvReturn_CreatedAt_idx" ON "InvReturn"("CreatedAt");

-- CreateIndex
CREATE INDEX "InvReturnLine_ItemID_idx" ON "InvReturnLine"("ItemID");

-- CreateIndex
CREATE UNIQUE INDEX "InvTransfer_TransferNo_key" ON "InvTransfer"("TransferNo");

-- CreateIndex
CREATE INDEX "InvTransfer_CreatedAt_idx" ON "InvTransfer"("CreatedAt");

-- CreateIndex
CREATE INDEX "InvTransferLine_ItemID_idx" ON "InvTransferLine"("ItemID");

-- CreateIndex
CREATE INDEX "InvStockLedger_ItemID_StoreID_MovementDate_idx" ON "InvStockLedger"("ItemID", "StoreID", "MovementDate");

-- CreateIndex
CREATE INDEX "InvStockLedger_ReferenceType_ReferenceID_idx" ON "InvStockLedger"("ReferenceType", "ReferenceID");

-- AddForeignKey
ALTER TABLE "InvItem" ADD CONSTRAINT "InvItem_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "InvCategory"("CategoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvItem" ADD CONSTRAINT "InvItem_GroupID_fkey" FOREIGN KEY ("GroupID") REFERENCES "InvGroup"("GroupID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvItem" ADD CONSTRAINT "InvItem_DefaultStoreID_fkey" FOREIGN KEY ("DefaultStoreID") REFERENCES "InvStore"("StoreID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseRequest" ADD CONSTRAINT "InvPurchaseRequest_StoreID_fkey" FOREIGN KEY ("StoreID") REFERENCES "InvStore"("StoreID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseRequestLine" ADD CONSTRAINT "InvPurchaseRequestLine_PurchaseRequestID_fkey" FOREIGN KEY ("PurchaseRequestID") REFERENCES "InvPurchaseRequest"("PurchaseRequestID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseRequestLine" ADD CONSTRAINT "InvPurchaseRequestLine_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "InvItem"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseOrder" ADD CONSTRAINT "InvPurchaseOrder_PurchaseRequestID_fkey" FOREIGN KEY ("PurchaseRequestID") REFERENCES "InvPurchaseRequest"("PurchaseRequestID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseOrder" ADD CONSTRAINT "InvPurchaseOrder_VendorID_fkey" FOREIGN KEY ("VendorID") REFERENCES "InvVendor"("VendorID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseOrder" ADD CONSTRAINT "InvPurchaseOrder_StoreID_fkey" FOREIGN KEY ("StoreID") REFERENCES "InvStore"("StoreID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseOrderLine" ADD CONSTRAINT "InvPurchaseOrderLine_PurchaseOrderID_fkey" FOREIGN KEY ("PurchaseOrderID") REFERENCES "InvPurchaseOrder"("PurchaseOrderID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvPurchaseOrderLine" ADD CONSTRAINT "InvPurchaseOrderLine_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "InvItem"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvGRN" ADD CONSTRAINT "InvGRN_PurchaseOrderID_fkey" FOREIGN KEY ("PurchaseOrderID") REFERENCES "InvPurchaseOrder"("PurchaseOrderID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvGRN" ADD CONSTRAINT "InvGRN_StoreID_fkey" FOREIGN KEY ("StoreID") REFERENCES "InvStore"("StoreID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvGRNLine" ADD CONSTRAINT "InvGRNLine_GRNID_fkey" FOREIGN KEY ("GRNID") REFERENCES "InvGRN"("GRNID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvGRNLine" ADD CONSTRAINT "InvGRNLine_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "InvItem"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvIssuance" ADD CONSTRAINT "InvIssuance_StoreID_fkey" FOREIGN KEY ("StoreID") REFERENCES "InvStore"("StoreID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvIssuanceLine" ADD CONSTRAINT "InvIssuanceLine_IssuanceID_fkey" FOREIGN KEY ("IssuanceID") REFERENCES "InvIssuance"("IssuanceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvIssuanceLine" ADD CONSTRAINT "InvIssuanceLine_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "InvItem"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvReturn" ADD CONSTRAINT "InvReturn_StoreID_fkey" FOREIGN KEY ("StoreID") REFERENCES "InvStore"("StoreID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvReturnLine" ADD CONSTRAINT "InvReturnLine_ReturnID_fkey" FOREIGN KEY ("ReturnID") REFERENCES "InvReturn"("ReturnID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvReturnLine" ADD CONSTRAINT "InvReturnLine_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "InvItem"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvTransfer" ADD CONSTRAINT "InvTransfer_FromStoreID_fkey" FOREIGN KEY ("FromStoreID") REFERENCES "InvStore"("StoreID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvTransfer" ADD CONSTRAINT "InvTransfer_ToStoreID_fkey" FOREIGN KEY ("ToStoreID") REFERENCES "InvStore"("StoreID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvTransferLine" ADD CONSTRAINT "InvTransferLine_TransferID_fkey" FOREIGN KEY ("TransferID") REFERENCES "InvTransfer"("TransferID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvTransferLine" ADD CONSTRAINT "InvTransferLine_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "InvItem"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvStockLedger" ADD CONSTRAINT "InvStockLedger_ItemID_fkey" FOREIGN KEY ("ItemID") REFERENCES "InvItem"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvStockLedger" ADD CONSTRAINT "InvStockLedger_StoreID_fkey" FOREIGN KEY ("StoreID") REFERENCES "InvStore"("StoreID") ON DELETE RESTRICT ON UPDATE CASCADE;
