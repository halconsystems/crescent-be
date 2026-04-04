-- CreateEnum
CREATE TYPE "DesignationType" AS ENUM ('GM', 'Manager', 'Staff', 'Technician');

-- CreateTable
CREATE TABLE "Office" (
    "OfficeID" SERIAL NOT NULL,
    "OfficeName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("OfficeID")
);

-- CreateTable
CREATE TABLE "Product" (
    "ProductID" SERIAL NOT NULL,
    "ProductName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductID")
);

-- CreateTable
CREATE TABLE "Bank" (
    "BankID" SERIAL NOT NULL,
    "BankName" TEXT NOT NULL,
    "BankCode" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("BankID")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "BankAccountID" SERIAL NOT NULL,
    "BankID" INTEGER NOT NULL,
    "AccountNo" TEXT NOT NULL,
    "IBAN" TEXT,
    "BranchCode" TEXT,
    "Branch" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("BankAccountID")
);

-- CreateTable
CREATE TABLE "City" (
    "CityID" SERIAL NOT NULL,
    "CityName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("CityID")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "VendorID" SERIAL NOT NULL,
    "VendorName" TEXT NOT NULL,
    "CityID" INTEGER,
    "Address" TEXT,
    "EmailID" TEXT,
    "ContactPerson" TEXT,
    "PrimaryMobile" TEXT,
    "SecondaryMobile" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("VendorID")
);

-- CreateTable
CREATE TABLE "Role" (
    "RoleID" SERIAL NOT NULL,
    "RoleName" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("RoleID")
);

-- CreateTable
CREATE TABLE "Employee" (
    "EmployeeID" SERIAL NOT NULL,
    "EmailID" TEXT,
    "PrimaryMobileNo" TEXT,
    "CNIC" TEXT NOT NULL,
    "Designation" "DesignationType" NOT NULL,
    "NextOfKin" TEXT,
    "NextOfKinContact" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("EmployeeID")
);

-- CreateTable
CREATE TABLE "AppUser" (
    "UserID" SERIAL NOT NULL,
    "EmployeeID" INTEGER,
    "UserName" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "IsTempPassword" BOOLEAN NOT NULL DEFAULT true,
    "MustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "IsEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "IsMobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsLocked" BOOLEAN NOT NULL DEFAULT false,
    "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "LastLoginAt" TIMESTAMP(3),
    "LastPasswordChangedAt" TIMESTAMP(3),
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "CreatedByUserID" INTEGER,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "UserRoleID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "RoleID" INTEGER NOT NULL,
    "AssignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "AssignedByUserID" INTEGER,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("UserRoleID")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "ResetTokenID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "TokenHash" TEXT NOT NULL,
    "RequestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ExpiresAt" TIMESTAMP(3) NOT NULL,
    "UsedAt" TIMESTAMP(3),
    "RequestedIP" TEXT,
    "RequestedUserAgent" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("ResetTokenID")
);

-- CreateTable
CREATE TABLE "UserPasswordHistory" (
    "PasswordHistoryID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPasswordHistory_pkey" PRIMARY KEY ("PasswordHistoryID")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "SessionID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "RefreshTokenHash" TEXT NOT NULL,
    "JwtID" TEXT,
    "DeviceInfo" TEXT,
    "IPV4" TEXT,
    "IPV6" TEXT,
    "UserAgent" TEXT,
    "IssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ExpiresAt" TIMESTAMP(3) NOT NULL,
    "LastUsedAt" TIMESTAMP(3),
    "RevokedAt" TIMESTAMP(3),
    "RevokedReason" TEXT,
    "ReplacedBySessionID" INTEGER,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("SessionID")
);

-- CreateTable
CREATE TABLE "ClientCategory" (
    "CategoryID" SERIAL NOT NULL,
    "CategoryName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCategory_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "Package" (
    "PackageID" SERIAL NOT NULL,
    "PackageName" TEXT NOT NULL,
    "MinCharges" DECIMAL(12,2),
    "MinRenewalCharges" DECIMAL(12,2),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("PackageID")
);

-- CreateTable
CREATE TABLE "Zone" (
    "ZoneID" SERIAL NOT NULL,
    "OfficeID" INTEGER NOT NULL,
    "ZoneName" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("ZoneID")
);

-- CreateTable
CREATE TABLE "ZoneEmployee" (
    "ZoneEmployeeID" SERIAL NOT NULL,
    "ZoneID" INTEGER NOT NULL,
    "EmployeeID" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneEmployee_pkey" PRIMARY KEY ("ZoneEmployeeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_OfficeName_key" ON "Office"("OfficeName");

-- CreateIndex
CREATE UNIQUE INDEX "Product_ProductName_key" ON "Product"("ProductName");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_BankName_key" ON "Bank"("BankName");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_BankCode_key" ON "Bank"("BankCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_IBAN_key" ON "BankAccount"("IBAN");

-- CreateIndex
CREATE UNIQUE INDEX "City_CityName_key" ON "City"("CityName");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_VendorName_key" ON "Vendor"("VendorName");

-- CreateIndex
CREATE UNIQUE INDEX "Role_RoleName_key" ON "Role"("RoleName");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_EmailID_key" ON "Employee"("EmailID");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_PrimaryMobileNo_key" ON "Employee"("PrimaryMobileNo");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_CNIC_key" ON "Employee"("CNIC");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_EmployeeID_key" ON "AppUser"("EmployeeID");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_UserName_key" ON "AppUser"("UserName");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_UserID_RoleID_key" ON "UserRole"("UserID", "RoleID");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_JwtID_key" ON "UserSession"("JwtID");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCategory_CategoryName_key" ON "ClientCategory"("CategoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Package_PackageName_key" ON "Package"("PackageName");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_OfficeID_ZoneName_key" ON "Zone"("OfficeID", "ZoneName");

-- CreateIndex
CREATE UNIQUE INDEX "ZoneEmployee_ZoneID_EmployeeID_key" ON "ZoneEmployee"("ZoneID", "EmployeeID");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_BankID_fkey" FOREIGN KEY ("BankID") REFERENCES "Bank"("BankID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_CityID_fkey" FOREIGN KEY ("CityID") REFERENCES "City"("CityID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_CreatedByUserID_fkey" FOREIGN KEY ("CreatedByUserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "AppUser"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_RoleID_fkey" FOREIGN KEY ("RoleID") REFERENCES "Role"("RoleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_AssignedByUserID_fkey" FOREIGN KEY ("AssignedByUserID") REFERENCES "AppUser"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "AppUser"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPasswordHistory" ADD CONSTRAINT "UserPasswordHistory_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "AppUser"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "AppUser"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_ReplacedBySessionID_fkey" FOREIGN KEY ("ReplacedBySessionID") REFERENCES "UserSession"("SessionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_OfficeID_fkey" FOREIGN KEY ("OfficeID") REFERENCES "Office"("OfficeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneEmployee" ADD CONSTRAINT "ZoneEmployee_ZoneID_fkey" FOREIGN KEY ("ZoneID") REFERENCES "Zone"("ZoneID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneEmployee" ADD CONSTRAINT "ZoneEmployee_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;
