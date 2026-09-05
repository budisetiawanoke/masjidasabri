/**
 * Sumber kebenaran tunggal untuk isi halaman /faq: pertanyaan umum (FAQ),
 * Buku Panduan Penggunaan (untuk jamaah), dan Playbook Pengurus & Jamaah.
 * Dipakai bersama oleh tampilan halaman web (src/app/(public)/faq/page.tsx,
 * lewat FaqAccordion.tsx & GuideSections.tsx) DAN berkas PDF unduhannya
 * (src/server/pdf/GuideDocument.tsx) — supaya isi yang tampil di layar
 * selalu sama persis dengan isi berkas yang diunduh, satu sumber data
 * bukan dua yang bisa berbeda-beda kalau salah satu diubah sendiri-sendiri
 * (pola sama seperti src/server/pdf/detail-report-data.ts).
 */

export type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

export type GuideSection = {
  heading: string;
  /** Paragraf penjelasan biasa, ditampilkan berurutan sebelum `steps` (kalau ada). */
  paragraphs?: string[];
  /** Langkah-langkah bernomor, mis. cara mengisi formulir. */
  steps?: string[];
};

export type GuideDoc = {
  title: string;
  subtitle: string;
  sections: GuideSection[];
};

export const FAQ_ITEMS: FaqItem[] = [
  // Umum
  {
    category: "Umum",
    question: "Apa itu aplikasi Masjid ASABRI ini?",
    answer:
      "Ini adalah sistem pengelolaan jamaah Masjid ASABRI: situs publik untuk melihat jadwal sholat, kegiatan, pengumuman, dan laporan keuangan, sekaligus tempat jamaah mencatat donasi, infaq/sadaqah, zakat, dan kurban. Ada juga Dashboard khusus login untuk pengurus mengelola semuanya.",
  },
  {
    category: "Umum",
    question: "Apakah saya perlu membuat akun untuk memakai aplikasi ini?",
    answer:
      "Tidak. Melihat jadwal sholat, kegiatan, pengumuman, dan laporan keuangan, serta mengirim donasi, infaq/sadaqah, pendaftaran zakat/kurban, dan Kotak Saran — semuanya bisa dilakukan TANPA akun/login. Akun Dashboard hanya diberikan pengurus (Super Admin, Admin/Pengurus, Bendahara) untuk keperluan pengelolaan, dan dibuatkan oleh Super Admin — bukan mendaftar sendiri.",
  },
  {
    category: "Umum",
    question: "Bagaimana cara menghubungi pengurus masjid?",
    answer:
      "Alamat, nomor telepon, dan email resmi yayasan ditampilkan di bagian bawah (footer) setiap halaman, serta di halaman Profil & Pengurus lengkap dengan susunan pengurusnya.",
  },
  // Donasi & Kampanye
  {
    category: "Donasi & Kampanye",
    question: "Bagaimana cara berdonasi untuk kampanye tertentu?",
    answer:
      "Buka halaman Donasi, transfer ke rekening tujuan kampanye tersebut (lihat rekening di kartu kampanye — kalau tidak ada rekening khusus, berarti pakai rekening umum yayasan di halaman Beranda), lalu isi formulir Donasi: pilih kampanye, isi nama, nominal (opsional), dan lampirkan bukti transfer kalau ada.",
  },
  {
    category: "Donasi & Kampanye",
    question: "Kenapa kampanye yang saya cari sudah tidak muncul di pilihan donasi?",
    answer:
      "Kampanye yang sudah ditutup pengurus (biasanya karena dananya sudah selesai disalurkan) otomatis hilang dari pilihan donasi baru, supaya jamaah tidak salah transfer ke kampanye yang sudah berakhir. Riwayat dan laporannya tetap bisa dilihat di daftar \"Laporan Donasi per Kampanye\" pada halaman Donasi, ditandai lencana \"Berakhir\" beserta keterangan penutupannya dari pengurus.",
  },
  {
    category: "Donasi & Kampanye",
    question: "Bagaimana saya tahu donasi saya sudah diterima/dikonfirmasi?",
    answer:
      "Setiap kampanye punya laporan publik yang menampilkan status setiap donasi: \"Menunggu Konfirmasi\" (baru tercatat, belum diperiksa pengurus) atau \"Dikonfirmasi\" (sudah diverifikasi pengurus). Buka laporan kampanyenya dari halaman Donasi untuk melihat status donasi Anda.",
  },
  {
    category: "Donasi & Kampanye",
    question: "Bisakah saya melihat laporan penggunaan dana kampanye?",
    answer:
      "Bisa. Ketuk salah satu kampanye di daftar \"Laporan Donasi per Kampanye\" pada halaman Donasi untuk membuka laporan rincinya per periode (bulan), lengkap dengan tabel donatur dan tombol unduh CSV/PDF.",
  },
  // Infaq & Sadaqah
  {
    category: "Infaq & Sadaqah",
    question: "Apa bedanya infaq untuk \"Operasional Masjid\" dengan peruntukan lain?",
    answer:
      "Infaq/sadaqah dengan peruntukan \"Operasional Masjid\" otomatis tercatat sebagai pemasukan kas yayasan begitu dikonfirmasi pengurus, dan akan muncul di Laporan Keuangan resmi. Peruntukan lain (mis. Dhuafa, Anak Yatim) dicatat terpisah dan disalurkan sesuai tujuannya masing-masing, tidak masuk kas operasional.",
  },
  {
    category: "Infaq & Sadaqah",
    question: "Bagaimana cara mencatat infaq/sadaqah saya?",
    answer:
      "Buka halaman Infaq & Sadaqah, pilih peruntukan, isi nama dan nominal (opsional), lalu lampirkan bukti transfer kalau ada transfer. Tidak perlu akun.",
  },
  // Zakat & Kurban
  {
    category: "Zakat & Kurban",
    question: "Bagaimana cara menghitung zakat maal saya?",
    answer:
      "Halaman Zakat punya Kalkulator Zakat Maal yang menghitung langsung di perangkat Anda berdasarkan nilai harta dan nisab emas terkini — cukup isi nominal harta, kalkulator menampilkan apakah sudah wajib zakat dan berapa besarnya (2,5%).",
  },
  {
    category: "Zakat & Kurban",
    question: "Bagaimana cara mendaftar zakat (fitrah/maal)?",
    answer:
      "Di halaman Zakat, isi formulir pendaftaran: jenis zakat, nama muzakki, kontak, jumlah jiwa (untuk zakat fitrah), lalu nominal beras dan/atau uang, dan bukti transfer kalau ada.",
  },
  {
    category: "Zakat & Kurban",
    question: "Bagaimana cara mendaftar kurban?",
    answer:
      "Di halaman Kurban, isi formulir: jenis hewan (Sapi per ekor, Sapi Patungan, atau Kambing/Domba), atas nama, kontak, jumlah bagian, nominal yang dibayarkan, dan bukti transfer kalau ada.",
  },
  {
    category: "Zakat & Kurban",
    question: "Kapan hewan kurban akan disembelih dan didistribusikan?",
    answer:
      "Jadwal penyembelihan dan distribusi ditentukan pengurus sesuai hari raya Idul Adha dan diumumkan lewat halaman Pengumuman/Kegiatan. Status pendaftaran kurban Anda (Terdaftar → Disembelih → Didistribusikan) bisa dipantau di laporan kurban pada halaman Kurban.",
  },
  // Laporan Keuangan
  {
    category: "Laporan Keuangan",
    question: "Bagaimana cara melihat laporan keuangan masjid?",
    answer:
      "Buka halaman Laporan Keuangan untuk melihat rincian pemasukan dan pengeluaran per kategori setiap bulan, beserta saldo kas, dan bisa berpindah bulan untuk melihat riwayatnya.",
  },
  {
    category: "Laporan Keuangan",
    question: "Apa bedanya transaksi \"menunggu pengesahan\" dan \"disahkan\"?",
    answer:
      "Bendahara mencatat transaksi kas sehari-hari, tapi transaksi itu baru dihitung resmi setelah disahkan oleh Super Admin (mekanisme dua langkah untuk transparansi). Laporan Keuangan publik hanya menampilkan transaksi yang SUDAH disahkan.",
  },
  {
    category: "Laporan Keuangan",
    question: "Bagaimana cara mengunduh laporan keuangan atau laporan kampanye?",
    answer:
      "Setiap halaman laporan (Laporan Keuangan, atau laporan per kampanye/peruntukan/jenis) punya tombol \"Unduh Excel / CSV\" dan \"Unduh PDF\". Ketuk tombolnya, akan muncul jendela pratinjau isi laporan, lalu ketuk \"Unduh\" di dalam jendela itu untuk menyimpan berkasnya.",
  },
  // Bukti Bayar
  {
    category: "Bukti Bayar",
    question: "Apakah wajib melampirkan bukti transfer saat berdonasi/infaq/zakat/kurban?",
    answer:
      "Tidak wajib, tapi disarankan supaya pengurus lebih mudah memverifikasi. Formulir tetap bisa dikirim tanpa lampiran, statusnya akan menunggu konfirmasi manual oleh pengurus.",
  },
  {
    category: "Bukti Bayar",
    question: "Bagaimana cara mendapatkan bukti bayar/kwitansi digital?",
    answer:
      "Setelah donasi/infaq/zakat/kurban Anda dikonfirmasi pengurus, tautan \"Unduh Bukti Bayar\" akan tersedia (biasanya dibagikan lewat kontak yang Anda cantumkan, atau terlihat di laporan publik kampanye/peruntukan terkait). Bukti bayar berisi rincian pemberian Anda, ucapan terima kasih, dan ayat Al-Qur'an yang relevan.",
  },
  // Kotak Saran
  {
    category: "Kotak Saran",
    question: "Bagaimana cara menyampaikan saran atau pengaduan ke pengurus?",
    answer:
      "Buka halaman Kotak Saran, isi formulirnya (boleh anonim, tanpa akun). Setelah terkirim, Anda akan mendapat kode pelacakan unik untuk memantau status dan tanggapan pengurus nantinya.",
  },
  {
    category: "Kotak Saran",
    question: "Bagaimana cara mengecek status saran/pengaduan yang sudah saya kirim?",
    answer:
      "Buka halaman Kotak Saran → Cek Status, lalu masukkan kode pelacakan yang Anda dapat saat mengirim. Tidak perlu akun untuk mengeceknya.",
  },
];

export const USER_GUIDE: GuideDoc = {
  title: "Buku Panduan Penggunaan",
  subtitle: "Untuk Jamaah — Situs Masjid ASABRI",
  sections: [
    {
      heading: "1. Mengenal Situs Masjid ASABRI",
      paragraphs: [
        "Situs ini dipakai untuk melihat informasi masjid (jadwal sholat, kegiatan, pengumuman, profil pengurus) dan mencatat pemberian Anda (donasi, infaq/sadaqah, zakat, kurban) secara mandiri, kapan saja, tanpa perlu datang langsung atau membuat akun.",
        "Menu utama ada di bagian atas situs (atau di menu \"hamburger\" pada tampilan HP): Beranda, Profil & Pengurus, Jadwal Sholat, Kegiatan, Pengumuman, Laporan Keuangan, Zakat, Kurban, Infaq & Sadaqah, Donasi, Kotak Saran, dan FAQ.",
      ],
    },
    {
      heading: "2. Melihat Jadwal Sholat, Kegiatan & Pengumuman",
      paragraphs: [
        "Halaman Jadwal Sholat menampilkan enam waktu sholat hari ini berdasarkan lokasi masjid. Halaman Kegiatan dan Pengumuman menampilkan informasi terbaru dari pengurus, lengkap dengan poster/banner kalau ada.",
      ],
    },
    {
      heading: "3. Cara Berdonasi ke Kampanye Tertentu",
      paragraphs: [
        "Kampanye donasi dibuat pengurus untuk kebutuhan tertentu (mis. bantuan bencana, pembangunan masjid). Buka halaman Donasi untuk melihat kampanye yang sedang berjalan beserta rekening tujuannya masing-masing.",
      ],
      steps: [
        "Buka halaman Donasi, lihat kartu \"Kampanye Aktif\" untuk tahu rekening tujuan transfer kampanye yang Anda pilih (kalau tidak tercantum rekening khusus, pakai rekening umum yayasan di halaman Beranda).",
        "Transfer sesuai nominal yang Anda niatkan ke rekening tersebut.",
        "Isi formulir \"Kirim Donasi\": pilih Kampanye Donasi, isi Nama, Kontak (opsional), Nominal (opsional), dan lampirkan Bukti Transfer kalau ada.",
        "Ketuk \"Kirim Donasi\". Donasi Anda langsung tercatat dengan status \"Menunggu Konfirmasi\" sampai diperiksa pengurus.",
        "Pantau statusnya kapan saja lewat \"Laporan Donasi per Kampanye\" di halaman yang sama — ketuk kampanyenya untuk lihat rincian per periode.",
      ],
    },
    {
      heading: "4. Cara Mencatat Infaq & Sadaqah",
      steps: [
        "Buka halaman Infaq & Sadaqah.",
        "Pilih Peruntukan (Operasional Masjid, Dhuafa, atau Anak Yatim).",
        "Isi Nama, Kontak (opsional), Nominal (opsional), dan Bukti Transfer (opsional).",
        "Ketuk \"Kirim Infaq/Sadaqah\".",
      ],
      paragraphs: [
        "Catatan: infaq untuk \"Operasional Masjid\" yang sudah dikonfirmasi pengurus otomatis masuk sebagai pemasukan kas resmi dan tampil di Laporan Keuangan.",
      ],
    },
    {
      heading: "5. Cara Mendaftar Zakat",
      paragraphs: [
        "Halaman Zakat punya Kalkulator Zakat Maal yang langsung menghitung di perangkat Anda — isi nilai harta Anda untuk mengetahui apakah sudah mencapai nisab dan berapa zakat yang wajib dikeluarkan (2,5%).",
      ],
      steps: [
        "Buka halaman Zakat.",
        "(Opsional) Pakai Kalkulator Zakat Maal untuk menghitung kewajiban zakat Anda.",
        "Isi formulir pendaftaran: Jenis Zakat (Fitrah/Maal), Nama Muzakki, No. HP/Kontak, Jumlah Jiwa (untuk Fitrah), Beras (kg) dan/atau Uang (Rp), lalu Bukti Transfer (opsional).",
        "Ketuk tombol kirim. Pantau status pendaftaran (Terdaftar → Lunas) di laporan zakat pada halaman yang sama.",
      ],
    },
    {
      heading: "6. Cara Mendaftar Kurban",
      steps: [
        "Buka halaman Kurban.",
        "Ketuk \"Daftar Qurban\", isi Jenis Hewan (Sapi (per ekor), Sapi (Patungan), atau Kambing/Domba), Atas Nama, No. HP, Jumlah Bagian, Tahun, Nominal Dibayarkan, dan Bukti Transfer (opsional).",
        "Ketuk tombol kirim. Pantau status (Terdaftar → Disembelih → Didistribusikan) di laporan kurban pada halaman yang sama.",
      ],
    },
    {
      heading: "7. Melihat & Mengunduh Laporan",
      paragraphs: [
        "Semua laporan publik (Laporan Keuangan, dan laporan per kampanye/peruntukan/jenis pada halaman Donasi/Infaq & Sadaqah/Zakat/Kurban) bisa dilihat langsung di layar dan diunduh.",
      ],
      steps: [
        "Buka laporan yang ingin dilihat, lalu ketuk salah satu baris (kampanye/peruntukan/jenis) untuk membuka rincian per periode.",
        "Pilih bulan/tahun yang ingin dilihat dari daftar periode di bagian atas.",
        "Ketuk \"Unduh Excel / CSV\" atau \"Unduh PDF\" — akan muncul jendela pratinjau isi laporan.",
        "Ketuk \"Unduh\" di dalam jendela pratinjau untuk menyimpan berkasnya, atau \"Tutup\" untuk kembali tanpa mengunduh.",
      ],
    },
    {
      heading: "8. Bukti Bayar (Kwitansi Digital)",
      paragraphs: [
        "Setiap donasi/infaq/zakat/kurban yang sudah dikonfirmasi pengurus punya bukti bayar digital berisi rincian pemberian Anda, ucapan terima kasih dari pengurus, dan ayat Al-Qur'an yang relevan dengan jenis pemberiannya. Cara mengunduhnya sama seperti laporan lain: ketuk tautan bukti bayar, lihat pratinjaunya, lalu ketuk \"Unduh\".",
      ],
    },
    {
      heading: "9. Menyampaikan Saran atau Pengaduan",
      steps: [
        "Buka halaman Kotak Saran, isi Subjek, Isi Pesan, pilih kategori (Saran/Pengaduan), dan boleh dikirim anonim.",
        "Setelah terkirim, simpan Kode Pelacakan yang muncul.",
        "Untuk cek status & tanggapan pengurus, buka Kotak Saran → Cek Status, lalu masukkan kode pelacakan tersebut.",
      ],
    },
    {
      heading: "10. Butuh Bantuan Lebih Lanjut?",
      paragraphs: [
        "Kalau ada pertanyaan yang belum terjawab di sini, cek dulu bagian Pertanyaan Umum (FAQ) di halaman ini, atau hubungi pengurus lewat kontak yang tercantum di bagian bawah situs (footer) atau halaman Profil & Pengurus.",
      ],
    },
  ],
};

export const PLAYBOOK: GuideDoc = {
  title: "Playbook Pengurus",
  subtitle: "Panduan Operasional Pengelolaan — Masjid ASABRI (Khusus Staf)",
  sections: [
    {
      heading: "1. Tentang Playbook Ini",
      paragraphs: [
        "Playbook ini merangkum alur kerja rutin pengurus dalam mengelola aplikasi Masjid ASABRI — mulai dari verifikasi donasi/infaq/zakat/kurban, pencatatan, sampai pengesahan sebagai transaksi kas resmi. Khusus untuk staf (Super Admin, Admin/Pengurus, Bendahara) — tidak ditampilkan ke jamaah umum.",
        "Akses Dashboard (/dashboard) hanya diberikan kepada pengurus yang punya akun, dengan tiga peran: Super Admin (akses penuh), Admin/Pengurus, dan Bendahara — masing-masing punya kewenangan berbeda sesuai tanggung jawabnya.",
      ],
    },
    {
      heading: "2. Alur Verifikasi Donasi, Infaq, Zakat & Kurban",
      steps: [
        "Jamaah mengirim formulir publik (Donasi/Infaq & Sadaqah/Zakat/Kurban) — otomatis tercatat berstatus \"Menunggu Konfirmasi\"/\"Terdaftar\", tanpa perlu akun.",
        "Pengurus membuka Dashboard → menu terkait (Infaq & Donasi, atau Zakat & Kurban), memeriksa data dan bukti transfer yang dilampirkan (kalau ada).",
        "Pengurus menekan tombol \"Konfirmasi\" (donasi/infaq) atau memperbarui status (zakat/kurban: Lunas/Disembelih/Didistribusikan) setelah memastikan dana benar diterima.",
        "Status yang diperbarui langsung terlihat jamaah di laporan publik terkait — tidak perlu langkah tambahan.",
      ],
    },
    {
      heading: "3. Mengelola Kampanye Donasi",
      paragraphs: [
        "Kampanye donasi dikelola dari Dashboard → Infaq & Donasi. Setiap kampanye bisa punya rekening tujuan sendiri (opsional) — kosongkan kalau memakai rekening umum yayasan.",
      ],
      steps: [
        "Tambah kampanye baru: ketuk \"Tambah Kampanye Baru\", isi Judul, Deskripsi (opsional), dan rekening tujuan khusus kalau perlu, lalu \"Tambah Kampanye\".",
        "Mengubah kampanye: ketuk \"Ubah\" pada kampanye terkait, perbarui judul/deskripsi/rekening, lalu \"Simpan Perubahan\".",
        "Menutup kampanye (setelah dana selesai disalurkan): ketuk \"Tutup Kampanye\", WAJIB isi keterangan penutupan (mis. \"Dana sudah disalurkan ke posko bencana pada tanggal ...\") — keterangan ini akan tampil ke jamaah di laporan publik.",
        "Kampanye yang ditutup otomatis hilang dari pilihan donasi baru, tapi riwayat & laporannya tetap tampil ke jamaah dengan lencana \"Berakhir\". Kalau perlu dibuka kembali, ketuk \"Buka Kembali\".",
      ],
    },
    {
      heading: "4. Pencatatan & Pengesahan Transaksi Keuangan",
      paragraphs: [
        "Sistem keuangan memakai mekanisme dua langkah untuk transparansi: Bendahara mencatat, Super Admin mengesahkan.",
      ],
      steps: [
        "Bendahara membuka Dashboard → Keuangan, mencatat transaksi pemasukan/pengeluaran sehari-hari lengkap dengan kategori dan nominalnya. Transaksi ini berstatus \"menunggu pengesahan\".",
        "Super Admin meninjau transaksi yang tercatat, lalu mengesahkannya (approve) — setelah disahkan, transaksi masuk hitungan saldo kas resmi dan tampil di Laporan Keuangan publik.",
        "Setiap koreksi transaksi tercatat di jejak audit internal (tidak menimpa data tanpa riwayat) — bisa ditelusuri kalau ada pertanyaan dari jamaah.",
        "Infaq/sadaqah dengan peruntukan \"Operasional Masjid\" yang dikonfirmasi otomatis tercatat sebagai transaksi pemasukan kas — tidak perlu dicatat manual lagi oleh Bendahara.",
      ],
    },
    {
      heading: "5. Mengelola Konten Publik",
      paragraphs: [
        "Pengumuman, Kegiatan, dan Profil & Pengurus dikelola dari menu Dashboard masing-masing. Setiap publikasi baru langsung tampil di halaman publik terkait tanpa perlu proses tambahan.",
      ],
    },
    {
      heading: "6. Menangani Kotak Saran",
      steps: [
        "Buka Dashboard → Kotak Saran untuk melihat semua saran/pengaduan yang masuk (termasuk yang anonim).",
        "Beri tanggapan pengurus pada tiket terkait — tanggapan ini bisa dilihat pengirim lewat halaman Cek Status memakai kode pelacakan mereka.",
      ],
    },
    {
      heading: "7. Mengelola Akun Pengguna & Data Jamaah",
      paragraphs: [
        "Hanya Super Admin yang bisa membuat/mengubah akun Dashboard (menu Pengguna) — jamaah tidak bisa mendaftar akun sendiri. Data Jamaah (menu Jamaah) adalah daftar keanggotaan/kontak jamaah, terpisah dari akun login.",
      ],
    },
    {
      heading: "8. Menjaga Kepercayaan Jamaah",
      paragraphs: [
        "Karena semua status (konfirmasi donasi, pengesahan transaksi, penutupan kampanye) langsung terlihat publik, pastikan setiap tindakan pengurus dilakukan sesuai fakta di lapangan — mis. jangan menutup kampanye sebelum dana benar-benar disalurkan, dan jangan mengesahkan transaksi yang belum diverifikasi buktinya. Transparansi ini adalah nilai utama aplikasi ini.",
      ],
    },
  ],
};
