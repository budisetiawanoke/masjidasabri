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

// Bidang rekening tujuan KHUSUS kampanye (opsional) — dipakai baik saat
// membuat maupun mengubah kampanye, lihat komentar di
// prisma/schema.prisma (model DonationCampaign) soal kenapa opsional.
const campaignBankFields = {
  bankName: z.string().trim().max(100).optional().nullable(),
  bankAccountNo: z.string().trim().max(50).optional().nullable(),
  bankAccountName: z.string().trim().max(150).optional().nullable(),
};

export const donationCampaignSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  ...campaignBankFields,
});
export type DonationCampaignInput = z.infer<typeof donationCampaignSchema>;

/** Sama seperti donationCampaignSchema, dipakai saat mengubah kampanye yang sudah ada (perlu `id`). */
export const donationCampaignUpdateSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  ...campaignBankFields,
});
export type DonationCampaignUpdateInput = z.infer<typeof donationCampaignUpdateSchema>;

/** Menutup kampanye WAJIB disertai keterangan untuk jamaah (lihat closeCampaign() di service.ts). */
export const closeCampaignSchema = z.object({
  id: z.string().trim().min(1),
  closingNote: z.string().trim().min(10, "Keterangan penutupan minimal 10 karakter — jelaskan singkat penyaluran dananya.").max(1000),
});
export type CloseCampaignInput = z.infer<typeof closeCampaignSchema>;
