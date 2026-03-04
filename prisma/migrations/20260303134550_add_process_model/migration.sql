-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('OPEN', 'FINISHED', 'EXTERNAL');

-- CreateTable
CREATE TABLE "process" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'OPEN',
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "process_number_key" ON "process"("number");

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
