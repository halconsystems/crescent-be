/*
  Warnings:

  - You are about to drop the `UserPasswordHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPasswordHistory" DROP CONSTRAINT "UserPasswordHistory_UserID_fkey";

-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_ReplacedBySessionID_fkey";

-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_UserID_fkey";

-- DropTable
DROP TABLE "UserPasswordHistory";

-- DropTable
DROP TABLE "UserSession";
