-- CreateTable
CREATE TABLE "RefreshToken" (
    "RefreshTokenID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "TokenHash" TEXT NOT NULL,
    "IssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ExpiresAt" TIMESTAMP(3) NOT NULL,
    "RevokedAt" TIMESTAMP(3),
    "RevokedReason" TEXT,
    "ReplacedByTokenID" INTEGER,
    "UserAgent" TEXT,
    "IPV4" TEXT,
    "IPV6" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("RefreshTokenID")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_TokenHash_key" ON "RefreshToken"("TokenHash");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "AppUser"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_ReplacedByTokenID_fkey" FOREIGN KEY ("ReplacedByTokenID") REFERENCES "RefreshToken"("RefreshTokenID") ON DELETE SET NULL ON UPDATE CASCADE;
