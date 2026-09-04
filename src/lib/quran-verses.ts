export type GivingKind = "DONASI" | "INFAQ" | "ZAKAT" | "KURBAN";

export type QuranVerse = {
  arabic: string;
  translation: string;
  reference: string;
};

/**
 * Ayat Al-Qur'an tentang keutamaan masing-masing jenis pemberian — dipakai
 * di bukti bayar (lihat src/server/pdf/ReceiptDocument.tsx). Terjemahan
 * mengikuti gaya terjemahan Kemenag RI yang umum dipakai di Indonesia.
 * Kalau ada koreksi teks/terjemahan yang diinginkan pengurus, cukup ubah
 * di sini — dipakai bersama oleh keempat jenis bukti bayar.
 */
export const QURAN_VERSES: Record<GivingKind, QuranVerse> = {
  DONASI: {
    arabic:
      "لَنْ تَنَالُوا الْبِرَّ حَتَّىٰ تُنْفِقُوا مِمَّا تُحِبُّونَ ۚ وَمَا تُنْفِقُوا مِنْ شَيْءٍ فَإِنَّ اللَّهَ بِهِ عَلِيمٌ",
    translation:
      "Kamu tidak akan memperoleh kebajikan yang sempurna sebelum kamu menginfakkan sebagian harta yang kamu cintai. Apa pun yang kamu infakkan, sesungguhnya Allah Maha Mengetahui.",
    reference: "QS. Ali 'Imran [3]: 92",
  },
  INFAQ: {
    arabic:
      "مَثَلُ الَّذِينَ يُنْفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَنْ يَشَاءُ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ",
    translation:
      "Perumpamaan (infak yang dikeluarkan oleh) orang-orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji. Allah melipatgandakan (pahala) bagi siapa yang Dia kehendaki. Allah Mahaluas, Maha Mengetahui.",
    reference: "QS. Al-Baqarah [2]: 261",
  },
  ZAKAT: {
    arabic:
      "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِمْ بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَاتَكَ سَكَنٌ لَهُمْ ۗ وَاللَّهُ سَمِيعٌ عَلِيمٌ",
    translation:
      "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan menyucikan mereka, dan berdoalah untuk mereka. Sesungguhnya doamu itu menjadi ketenteraman jiwa bagi mereka. Allah Maha Mendengar, Maha Mengetahui.",
    reference: "QS. At-Taubah [9]: 103",
  },
  KURBAN: {
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ فَصَلِّ لِرَبِّكَ وَانْحَرْ",
    translation:
      "Sesungguhnya Kami telah memberimu (Nabi Muhammad) nikmat yang banyak. Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah (sebagai ibadah dan mendekatkan diri kepada Allah).",
    reference: "QS. Al-Kautsar [108]: 1-2",
  },
};

/** Label jenis pemberian dalam kalimat baku, dipakai di bukti bayar. */
export const GIVING_LABEL: Record<GivingKind, string> = {
  DONASI: "donasi",
  INFAQ: "infaq/sadaqah",
  ZAKAT: "zakat",
  KURBAN: "kurban",
};
