-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_pendingTransferToUserId_fkey" FOREIGN KEY ("pendingTransferToUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
