-- CreateEnum
CREATE TYPE "ProcessEventEnum" AS ENUM ('CREATED', 'TRANSFER_SENT', 'TRANSFER_ACCEPTED', 'TRANSFER_REJECTED', 'FINISHED', 'REOPENED', 'EXTERNAL_SENT', 'EXTERNAL_RECOVERED', 'ADMIN_TAKE_OVER', 'ADMIN_FORCE_TRANSFER', 'DATA_EDITED');

-- CreateTable
CREATE TABLE "process_event" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "type" "ProcessEventEnum" NOT NULL,
    "actorId" TEXT NOT NULL,
    "fromUserId" TEXT,
    "toUserId" TEXT,
    "observation" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "process_event" ADD CONSTRAINT "process_event_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_event" ADD CONSTRAINT "process_event_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_event" ADD CONSTRAINT "process_event_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_event" ADD CONSTRAINT "process_event_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
