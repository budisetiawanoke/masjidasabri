-- AlterTable
ALTER TABLE "InfaqRecord" ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "InfaqRecord_transactionId_key" ON "InfaqRecord"("transactionId");

-- AddForeignKey
ALTER TABLE "InfaqRecord" ADD CONSTRAINT "InfaqRecord_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

