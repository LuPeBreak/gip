/*
  Warnings:

  - The values [EXTERNAL] on the enum `ProcessStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProcessStatus_new" AS ENUM ('OPEN', 'FINISHED');
ALTER TABLE "public"."process" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "process" ALTER COLUMN "status" TYPE "ProcessStatus_new" USING ("status"::text::"ProcessStatus_new");
ALTER TYPE "ProcessStatus" RENAME TO "ProcessStatus_old";
ALTER TYPE "ProcessStatus_new" RENAME TO "ProcessStatus";
DROP TYPE "public"."ProcessStatus_old";
ALTER TABLE "process" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "process" ADD COLUMN     "pendingTransferCreatedAt" TIMESTAMP(3),
ADD COLUMN     "pendingTransferObservation" TEXT,
ADD COLUMN     "pendingTransferToUserId" TEXT;
