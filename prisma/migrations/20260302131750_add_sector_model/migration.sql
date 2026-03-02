-- AlterTable
ALTER TABLE "user" ADD COLUMN     "sectorId" TEXT;

-- CreateTable
CREATE TABLE "sector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sector_name_key" ON "sector"("name");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
