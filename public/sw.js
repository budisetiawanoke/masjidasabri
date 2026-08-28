// Service worker minimal untuk Masjid ASABRI.
//
// PRINSIP KESELAMATAN DATA: aplikasi ini punya data dinamis sensitif per
// peran (saldo kas, data jamaah, sesi login) — jadi service worker ini
// SENGAJA TIDAK men-cache halaman (navigasi) atau permintaan API/auth sama
// sekali. Yang di-cache hanya aset statis ber-hash (JS/CSS/font bawaan
// Next.js) yang aman dipakai ulang karena isinya tidak pernah berubah tanpa
// nama berkas ikut berubah. Ini bukan PWA "offline-first" penuh — hanya
// mempercepat pemuatan ulang aset dan membuat halaman bisa "Add to Home
// Screen" sebagai app terinstal.

const STATIC_CACHE = "masjid-asabri-static-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

function isCacheableStaticAsset(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/uploads/") ||
      /\.(?:png|jpg|jpeg|webp|svg|woff2?)$/.test(url.pathname))
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return; // jangan pernah campuri POST/PUT/DELETE (server actions, form submit)

  const url = new URL(request.url);
  if (!isCacheableStaticAsset(url)) return; // biarkan browser tangani navigasi/API seperti biasa (selalu dari jaringan)

  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
  );
});
