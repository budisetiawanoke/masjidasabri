import { z } from "zod";

export const infaqRecordSchema = z.object({
  category: z.enum(["OPERASIONAL", "DHUAFA", "ANAK_YATIM"]),
  donorName: z.string().trim().min(2).max(150),
  contactInfo: z.string().trim().max(50).optional().nullable(),
  amount: z.coerce.number().int().min(0).optional().nullable(),
});
export type InfaqRecordInput = z.infer<typeof infaqRecordSchema>;

export const donationRecordSchema = z.object({
  campaignId: z.string().trim().min(1, "Pilih kampanye donasi."),
  donorName: z.string().trim().min(2).max(150),
  contactInfo: z.string().trim().max(50).optional().nullable(),
  amount: z.coerce.number().int().min(0).optional().nullable(),
});
export type DonationRecordInput = z.infer<typeof donationRecordSchema>;

export const donationCampaignSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().max(1000).optional().nullable(),
});
export type DonationCampaignInput = z.infer<typeof donationCampaignSchema>;
