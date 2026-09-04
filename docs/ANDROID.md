# Aplikasi Android (APK) — Masjid ASABRI

## Cara kerja

Masjid ASABRI adalah aplikasi web *server-rendered* (autentikasi, server
actions, database) — **bukan** situs statis yang bisa dibundel offline ke
dalam APK. Versi Androidnya adalah pembungkus native (via
[Capacitor](https://capacitorjs.com)) yang menampilkan situs yang sudah
online di dalam `WebView` layar penuh tanpa chrome browser — bukan aplikasi
native terpisah dengan logic-nya sendiri. Ini pola yang sama dipakai banyak
aplikasi produksi (mis. Twitter/X, Instagram versi awal, banyak aplikasi
perbankan) untuk membungkus web app yang sudah matang.

Konsekuensinya: **APK butuh URL yang bisa diakses dari internet** untuk
dituju. Tidak bisa menunjuk ke `localhost` kecuali untuk uji coba di
komputer yang sama.

## Status saat ini

Proyek Android (`android/`) sudah lengkap dibuat dan **sudah diverifikasi
bisa di-build dan berjalan**: APK debug berhasil dibuat, diinstal ke Android
Emulator, dan diverifikasi menampilkan aplikasi sungguhan dengan benar
(lambang, jadwal sholat live dari Aladhan API, navigasi antar halaman) —
lihat `docs/STATUS.md` untuk detail verifikasi.

Build uji coba awal mengarah ke URL tunnel sementara (`cloudflared`) yang
sudah dimatikan setelah pengujian selesai — bukan URL permanen, jangan
dipakai untuk distribusi sungguhan.

**Update**: aplikasi sudah live di Firebase App Hosting
(`https://masjidasabri--masjidasabri-a959d.asia-southeast1.hosted.app`) dan
APK sideload sudah di-build mengarah ke URL itu — lihat langkah "Membuat APK
untuk distribusi" di bawah untuk rebuild kalau URL produksi berubah lagi
(mis. domain resmi yayasan sendiri di kemudian hari).

## Membuat APK untuk distribusi (sideload)

### 1. Pastikan situs sudah online

APK final harus menunjuk ke URL produksi sungguhan (lihat
[docs/DEPLOYMENT.md](DEPLOYMENT.md)) — bukan tunnel sementara atau
localhost.

> ⚠️ **Jebakan saat uji coba lewat tunnel + `next dev`**: kalau APK diarahkan
> ke tunnel sementara (cloudflared/ngrok) yang mem-proxy `next dev` (bukan
> `next start`/produksi), Next.js **memblokir diam-diam** permintaan
> cross-origin ke aset `/_next/static/*` dari domain tunnel (fitur keamanan
> dev server, lihat `allowedDevOrigins` di `next.config.ts`). Akibatnya:
> halaman tetap tampil normal (HTML awal dari server tetap terkirim), tapi
> komponen client tertentu (mis. tombol menu burger `MobileNav.tsx`) gagal
> hydrate — **terlihat ada tapi sama sekali tidak merespons ketukan** — tanpa
> error yang terlihat di layar. Sudah ditambahkan `allowedDevOrigins:
> ["*.trycloudflare.com"]` di `next.config.ts` untuk mengatasi ini; kalau
> pakai tunnel provider lain, tambahkan pola host-nya di sana juga. Ini
> **tidak relevan untuk `next start`/produksi sungguhan** — hanya berlaku
> saat APK menunjuk ke dev server.

> ⚠️ **Jebakan kedua: `NEXTAUTH_URL` di `.env` bikin login "gagal" lewat
> tunnel**. Kalau `.env` lokal mengisi `NEXTAUTH_URL="http://localhost:3000"`,
> Auth.js SELALU memakai nilai itu untuk redirect setelah login — mengabaikan
> `trustHost` dan header `Host` permintaan yang sesungguhnya sepenuhnya
> (perilaku `createActionURL` di `@auth/core`, bukan bug Next.js). Akibatnya:
> login lewat APK/tunnel tampak berhasil sebentar lalu **melempar ke browser
> sistem HP yang mencoba membuka `localhost:3000/dashboard`** (tidak ada
> apa-apa di situ dari sisi HP, jadi terlihat seperti login gagal total).
> Solusi: biarkan `NEXTAUTH_URL` **tidak diisi** di `.env` lokal (lihat
> `.env.example`) — Auth.js lalu mendeteksi origin otomatis dari header Host
> yang masuk, benar baik diakses via `localhost`, tunnel, maupun IP LAN.
> Hanya isi `NEXTAUTH_URL` di lingkungan produksi sungguhan yang domainnya
> sudah pasti/tidak berubah.

### 2. Build APK

```bash
CAPACITOR_SERVER_URL="https://url-produksi-anda.com" npm run android:build:debug
```

Berkas APK hasil build ada di:
`android/app/build/outputs/apk/debug/app-debug.apk`

Berkas ini bisa langsung dibagikan ke jamaah (mis. lewat grup WhatsApp,
Google Drive, atau situs unduhan) — pengguna perlu mengizinkan "Instal dari
sumber tidak dikenal" di pengaturan Android mereka saat membuka berkas
`.apk` (langkah normal untuk instalasi di luar Play Store).

### 3. (Opsional) Build APK release yang ditandatangani

APK debug di atas bisa langsung dipakai untuk sideload, tapi tidak
ditandatangani dengan kunci produksi (memakai kunci debug default Android).
Untuk keperluan jangka panjang atau jika suatu saat ingin ke Google Play,
buat kunci penandatanganan sendiri:

```bash
keytool -genkey -v -keystore masjid-asabri-release.keystore \
  -alias masjid-asabri -keyalg RSA -keysize 2048 -validity 10000
```

**Simpan file `.keystore` dan kata sandinya di tempat aman — hilang berarti
tidak bisa lagi merilis update ke pengguna yang sudah install versi lama
dengan ID aplikasi yang sama.** Lalu konfigurasikan
`android/app/build.gradle` (bagian `signingConfigs`) sesuai dokumentasi
resmi Android sebelum menjalankan `./gradlew assembleRelease`.

## Persyaratan lingkungan build

Sudah terverifikasi berjalan di mesin ini dengan:
- Android SDK (`~/Library/Android/sdk`) — platform-tools, build-tools, platform API tersedia
- JDK 21 (`brew install openjdk@21`) — **wajib**, JDK 8/17 bawaan sistem tidak cukup untuk Capacitor 8.x
- Gradle wrapper bawaan proyek (`android/gradlew`) — mengunduh Gradle otomatis, tidak perlu instal Gradle terpisah

## Memperbarui APK setelah update kode

Setiap kali kode web berubah dan sudah di-deploy ulang, APK yang sudah
terinstal otomatis menampilkan versi terbaru saat dibuka ulang (karena
memuat langsung dari URL live) — **tidak perlu rebuild APK** untuk
perubahan konten/fitur biasa.

Rebuild APK hanya diperlukan bila:
- URL server berubah (domain baru, pindah hosting)
- Konfigurasi native berubah (nama app, ikon, splash screen, izin Android)
- Ingin menaikkan versi yang tercatat di `android/app/build.gradle` (`versionCode`/`versionName`)

## Ikon & Splash Screen

Dibuat otomatis dari lambang yayasan lewat route gambar dinamis
(`src/app/api/pwa-icon/route.tsx` untuk ikon, `src/app/api/splash-image/route.tsx`
untuk splash screen) — bukan logo generik bawaan Capacitor. Untuk
meregenerasi ulang (mis. setelah warna merek berubah), jalankan dev server
lalu unduh ulang berkas PNG di `android/app/src/main/res/mipmap-*/` dan
`drawable*/splash.png` dari endpoint tersebut pada ukuran yang sesuai
(lihat riwayat commit untuk daftar ukuran per density).
