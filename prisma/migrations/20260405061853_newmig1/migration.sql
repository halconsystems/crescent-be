/*
  Warnings:

  - You are about to drop the column `UserName` on the `AppUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AppUser_UserName_key";

-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "UserName";
