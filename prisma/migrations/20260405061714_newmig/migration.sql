/*
  Warnings:

  - You are about to drop the column `CreatedByUserID` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `EmployeeID` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `FailedLoginAttempts` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `IsActive` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `IsEmailVerified` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `IsLocked` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `IsMobileVerified` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `IsTempPassword` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `LastLoginAt` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `LastPasswordChangedAt` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `MustChangePassword` on the `AppUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[EmailID]` on the table `AppUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CNIC]` on the table `AppUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Address` to the `AppUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CNIC` to the `AppUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ContactNo` to the `AppUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DOB` to the `AppUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EmailID` to the `AppUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppUser" DROP CONSTRAINT "AppUser_CreatedByUserID_fkey";

-- DropForeignKey
ALTER TABLE "AppUser" DROP CONSTRAINT "AppUser_EmployeeID_fkey";

-- DropIndex
DROP INDEX "AppUser_EmployeeID_key";

-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "CreatedByUserID",
DROP COLUMN "EmployeeID",
DROP COLUMN "FailedLoginAttempts",
DROP COLUMN "IsActive",
DROP COLUMN "IsEmailVerified",
DROP COLUMN "IsLocked",
DROP COLUMN "IsMobileVerified",
DROP COLUMN "IsTempPassword",
DROP COLUMN "LastLoginAt",
DROP COLUMN "LastPasswordChangedAt",
DROP COLUMN "MustChangePassword",
ADD COLUMN     "Address" TEXT NOT NULL,
ADD COLUMN     "CNIC" TEXT NOT NULL,
ADD COLUMN     "ContactNo" TEXT NOT NULL,
ADD COLUMN     "DOB" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "EmailID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_EmailID_key" ON "AppUser"("EmailID");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_CNIC_key" ON "AppUser"("CNIC");
