-- DropForeignKey
ALTER TABLE "process_event" DROP CONSTRAINT "process_event_processId_fkey";

-- AddForeignKey
ALTER TABLE "process_event" ADD CONSTRAINT "process_event_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
