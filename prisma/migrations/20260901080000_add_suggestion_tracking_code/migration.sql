-- AlterTable
ALTER TABLE "SuggestionTicket" ADD COLUMN     "trackingCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SuggestionTicket_trackingCode_key" ON "SuggestionTicket"("trackingCode");
