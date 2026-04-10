-- RBAC (Permission / RolePermission), Employee.UserID → AppUser, operations lookups, sales workflow tables.
-- Drops legacy `Client` table (replaced by sale client details per docs).

CREATE TYPE "SaleStageCode" AS ENUM ('SALES', 'ACCOUNTS', 'OPERATIONS', 'TECHNICIAN');
CREATE TYPE "StageStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'HELD', 'REJECTED');
CREATE TYPE "SaleType" AS ENUM ('CREDIT', 'CASH', 'CHEQUE', 'TRANSFER');
CREATE TYPE "AccountsDecision" AS ENUM ('HOLD', 'APPROVED', 'REJECTED', 'CONTINUE');
CREATE TYPE "TransmissionType" AS ENUM ('AUTO', 'MANUAL');

ALTER TABLE "Employee" ADD COLUMN "UserID" INTEGER;
CREATE UNIQUE INDEX "Employee_UserID_key" ON "Employee"("UserID");
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

DROP TABLE IF EXISTS "Client";

CREATE TABLE "Permission" (
    "PermissionID" SERIAL NOT NULL,
    "PermissionCode" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("PermissionID")
);

CREATE TABLE "RolePermission" (
    "RolePermissionID" SERIAL NOT NULL,
    "RoleID" INTEGER NOT NULL,
    "PermissionID" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("RolePermissionID")
);

CREATE UNIQUE INDEX "Permission_PermissionCode_key" ON "Permission"("PermissionCode");
CREATE UNIQUE INDEX "RolePermission_RoleID_PermissionID_key" ON "RolePermission"("RoleID", "PermissionID");

ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_RoleID_fkey" FOREIGN KEY ("RoleID") REFERENCES "Role"("RoleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_PermissionID_fkey" FOREIGN KEY ("PermissionID") REFERENCES "Permission"("PermissionID") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Device" (
    "DeviceID" SERIAL NOT NULL,
    "DeviceName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Device_pkey" PRIMARY KEY ("DeviceID")
);

CREATE TABLE "SIM" (
    "SIMID" SERIAL NOT NULL,
    "SIMName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SIM_pkey" PRIMARY KEY ("SIMID")
);

CREATE TABLE "DeviceCombo" (
    "DeviceComboID" SERIAL NOT NULL,
    "ComboName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DeviceCombo_pkey" PRIMARY KEY ("DeviceComboID")
);

CREATE TABLE "Accessory" (
    "AccessoryID" SERIAL NOT NULL,
    "AccessoryName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("AccessoryID")
);

CREATE UNIQUE INDEX "Device_DeviceName_key" ON "Device"("DeviceName");
CREATE UNIQUE INDEX "SIM_SIMName_key" ON "SIM"("SIMName");
CREATE UNIQUE INDEX "DeviceCombo_ComboName_key" ON "DeviceCombo"("ComboName");
CREATE UNIQUE INDEX "Accessory_AccessoryName_key" ON "Accessory"("AccessoryName");

CREATE TABLE "Sale" (
    "SaleID" SERIAL NOT NULL,
    "SaleCode" TEXT NOT NULL,
    "CreatedByUserID" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Sale_pkey" PRIMARY KEY ("SaleID")
);

CREATE TABLE "SaleClientDetails" (
    "SaleClientDetailsID" SERIAL NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "ClientCategoryID" INTEGER,
    "IRNo" TEXT,
    "FullName" TEXT,
    "CNICNo" TEXT,
    "PhoneHome" TEXT,
    "EmailID" TEXT,
    "Address" TEXT,
    "ClientStatus" TEXT,
    "CellNo" TEXT,
    "FatherName" TEXT,
    "DateOfBirth" TIMESTAMP(3),
    "PhoneOffice" TEXT,
    "CompanyDepartment" TEXT,
    "AddressLine2" TEXT,
    CONSTRAINT "SaleClientDetails_pkey" PRIMARY KEY ("SaleClientDetailsID")
);

CREATE TABLE "SaleProductDetails" (
    "SaleProductDetailsID" SERIAL NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "ProductID" INTEGER,
    "SaleAmount" DECIMAL(12,2),
    "SaleType" "SaleType",
    "PackageID" INTEGER,
    "RenewalCharges" DECIMAL(12,2),
    "CustomTypeValue" INTEGER,
    "SalesRemarks" TEXT,
    CONSTRAINT "SaleProductDetails_pkey" PRIMARY KEY ("SaleProductDetailsID")
);

CREATE TABLE "SaleAccountsReview" (
    "SaleAccountsReviewID" SERIAL NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "AccountsRemark" TEXT,
    "Decision" "AccountsDecision",
    "ReviewedByUserID" INTEGER,
    "ReviewedAt" TIMESTAMP(3),
    CONSTRAINT "SaleAccountsReview_pkey" PRIMARY KEY ("SaleAccountsReviewID")
);

CREATE TABLE "SaleOperationsAssignment" (
    "SaleOperationsAssignmentID" SERIAL NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "ProductID" INTEGER,
    "ZoneID" INTEGER,
    "DeviceComboID" INTEGER,
    "SIMID" INTEGER,
    "Accessory1ID" INTEGER,
    "Accessory2ID" INTEGER,
    "Accessory3ID" INTEGER,
    "PackageID" INTEGER,
    "AssignedTechnicianUserID" INTEGER,
    "DeviceID" INTEGER,
    "AssignedByUserID" INTEGER,
    "AssignedAt" TIMESTAMP(3),
    CONSTRAINT "SaleOperationsAssignment_pkey" PRIMARY KEY ("SaleOperationsAssignmentID")
);

CREATE TABLE "SaleInstallation" (
    "SaleInstallationID" SERIAL NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "InstallationDate" TIMESTAMP(3),
    "RenewalDate" TIMESTAMP(3),
    "RegistrationNo" TEXT,
    "EngineNo" TEXT,
    "TransmissionType" "TransmissionType",
    "ChassisNo" TEXT,
    "MakeModel" TEXT,
    "VehicleYear" INTEGER,
    "Color" TEXT,
    "InstalledByUserID" INTEGER,
    "InstalledAt" TIMESTAMP(3),
    CONSTRAINT "SaleInstallation_pkey" PRIMARY KEY ("SaleInstallationID")
);

CREATE TABLE "SaleStageStatus" (
    "SaleStageStatusID" SERIAL NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "StageCode" "SaleStageCode" NOT NULL,
    "Status" "StageStatus" NOT NULL DEFAULT 'PENDING',
    "UpdatedByUserID" INTEGER,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SaleStageStatus_pkey" PRIMARY KEY ("SaleStageStatusID")
);

CREATE TABLE "SaleAuditLog" (
    "SaleAuditLogID" SERIAL NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "StageCode" "SaleStageCode",
    "FieldName" TEXT NOT NULL,
    "OldValue" TEXT,
    "NewValue" TEXT,
    "ChangedByUserID" INTEGER NOT NULL,
    "ChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SaleAuditLog_pkey" PRIMARY KEY ("SaleAuditLogID")
);

CREATE UNIQUE INDEX "Sale_SaleCode_key" ON "Sale"("SaleCode");
CREATE UNIQUE INDEX "SaleClientDetails_SaleID_key" ON "SaleClientDetails"("SaleID");
CREATE UNIQUE INDEX "SaleProductDetails_SaleID_key" ON "SaleProductDetails"("SaleID");
CREATE UNIQUE INDEX "SaleAccountsReview_SaleID_key" ON "SaleAccountsReview"("SaleID");
CREATE UNIQUE INDEX "SaleOperationsAssignment_SaleID_key" ON "SaleOperationsAssignment"("SaleID");
CREATE UNIQUE INDEX "SaleInstallation_SaleID_key" ON "SaleInstallation"("SaleID");
CREATE UNIQUE INDEX "SaleStageStatus_SaleID_StageCode_key" ON "SaleStageStatus"("SaleID", "StageCode");

ALTER TABLE "Sale" ADD CONSTRAINT "Sale_CreatedByUserID_fkey" FOREIGN KEY ("CreatedByUserID") REFERENCES "AppUser"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SaleClientDetails" ADD CONSTRAINT "SaleClientDetails_SaleID_fkey" FOREIGN KEY ("SaleID") REFERENCES "Sale"("SaleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleClientDetails" ADD CONSTRAINT "SaleClientDetails_ClientCategoryID_fkey" FOREIGN KEY ("ClientCategoryID") REFERENCES "ClientCategory"("CategoryID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleProductDetails" ADD CONSTRAINT "SaleProductDetails_SaleID_fkey" FOREIGN KEY ("SaleID") REFERENCES "Sale"("SaleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleProductDetails" ADD CONSTRAINT "SaleProductDetails_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleProductDetails" ADD CONSTRAINT "SaleProductDetails_PackageID_fkey" FOREIGN KEY ("PackageID") REFERENCES "Package"("PackageID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleAccountsReview" ADD CONSTRAINT "SaleAccountsReview_SaleID_fkey" FOREIGN KEY ("SaleID") REFERENCES "Sale"("SaleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleAccountsReview" ADD CONSTRAINT "SaleAccountsReview_ReviewedByUserID_fkey" FOREIGN KEY ("ReviewedByUserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_SaleID_fkey" FOREIGN KEY ("SaleID") REFERENCES "Sale"("SaleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_ZoneID_fkey" FOREIGN KEY ("ZoneID") REFERENCES "Zone"("ZoneID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_DeviceComboID_fkey" FOREIGN KEY ("DeviceComboID") REFERENCES "DeviceCombo"("DeviceComboID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_SIMID_fkey" FOREIGN KEY ("SIMID") REFERENCES "SIM"("SIMID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_Accessory1ID_fkey" FOREIGN KEY ("Accessory1ID") REFERENCES "Accessory"("AccessoryID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_Accessory2ID_fkey" FOREIGN KEY ("Accessory2ID") REFERENCES "Accessory"("AccessoryID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_Accessory3ID_fkey" FOREIGN KEY ("Accessory3ID") REFERENCES "Accessory"("AccessoryID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_PackageID_fkey" FOREIGN KEY ("PackageID") REFERENCES "Package"("PackageID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_AssignedTechnicianUserID_fkey" FOREIGN KEY ("AssignedTechnicianUserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_DeviceID_fkey" FOREIGN KEY ("DeviceID") REFERENCES "Device"("DeviceID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleOperationsAssignment" ADD CONSTRAINT "SaleOperationsAssignment_AssignedByUserID_fkey" FOREIGN KEY ("AssignedByUserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleInstallation" ADD CONSTRAINT "SaleInstallation_SaleID_fkey" FOREIGN KEY ("SaleID") REFERENCES "Sale"("SaleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleInstallation" ADD CONSTRAINT "SaleInstallation_InstalledByUserID_fkey" FOREIGN KEY ("InstalledByUserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleStageStatus" ADD CONSTRAINT "SaleStageStatus_SaleID_fkey" FOREIGN KEY ("SaleID") REFERENCES "Sale"("SaleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleStageStatus" ADD CONSTRAINT "SaleStageStatus_UpdatedByUserID_fkey" FOREIGN KEY ("UpdatedByUserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SaleAuditLog" ADD CONSTRAINT "SaleAuditLog_SaleID_fkey" FOREIGN KEY ("SaleID") REFERENCES "Sale"("SaleID") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleAuditLog" ADD CONSTRAINT "SaleAuditLog_ChangedByUserID_fkey" FOREIGN KEY ("ChangedByUserID") REFERENCES "AppUser"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
