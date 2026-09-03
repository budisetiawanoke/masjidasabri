-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "InfaqRecord" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "contactInfo" TEXT,
    "amount" INTEGER,
    "proofImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DITERIMA',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InfaqRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationCampaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonationCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationRecord" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "contactInfo" TEXT,
    "amount" INTEGER,
    "proofImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DITERIMA',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InfaqRecord_recordedAt_idx" ON "InfaqRecord"("recordedAt");

-- CreateIndex
CREATE INDEX "DonationRecord_recordedAt_idx" ON "DonationRecord"("recordedAt");

-- AddForeignKey
ALTER TABLE "DonationRecord" ADD CONSTRAINT "DonationRecord_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "DonationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

