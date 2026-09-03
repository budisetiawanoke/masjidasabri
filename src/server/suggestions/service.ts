import "server-only";
import { prisma } from "@/lib/prisma";
import { assertCan } from "@/lib/rbac";
import { writeAuditLog } from "@/server/audit/log";
import type { Role } from "@prisma/client";
import type { SuggestionInput } from "@/server/suggestions/schema";

type Actor = { id: string; role: Role };

// Karakter aman untuk diketik ulang manusia — tanpa 0/O, 1/I/L yang gampang
// tertukar. Ruang kode ~32^8 ≈ 1 triliun kombinasi, jauh lebih dari cukup
// untuk volume tiket satu masjid tanpa perlu skema anti-tabrakan yang rumit.
const TRACKING_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateTrackingCode(): string {
  let raw = "";
  for (let i = 0; i < 8; i++) {
    raw += TRACKING_CODE_ALPHABET[Math.floor(Math.random() * TRACKING_CODE_ALPHABET.length)];
  }
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

/** Normalisasi input kode dari pengguna (spasi, huruf kecil, tanpa strip). */
function normalizeTrackingCode(code: string): string {
  const cleaned = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return cleaned.length === 8 ? `${cleaned.slice(0, 4)}-${cleaned.slice(4)}` : cleaned;
}

/**
 * Jamaah TIDAK perlu akun untuk mengirim atau melacak saran/pengaduan —
 * setiap tiket (anonim maupun bukan) selalu diberi kode pelacakan publik yang
 * bisa dipakai siapa saja di /kotak-saran/cek-status untuk melihat status &
 * tanggapan tanpa login. Login (akun peran JAMAAH) kini hanya untuk kasus
 * khusus (relawan/panitia aktif) — bukan syarat memakai Kotak Saran.
 */
export async function createSuggestion(actor: Actor | null, input: SuggestionInput) {
  // Tabrakan kode praktis mustahil (lihat catatan di generateTrackingCode),
  // tapi tetap dicoba ulang beberapa kali kalau unique constraint kena —
  // lebih aman daripada gagal total karena kejadian sekali dalam semiliar.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.suggestionTicket.create({
        data: {
          subject: input.subject,
          message: input.message,
          category: input.category,
          isAnonymous: input.isAnonymous ?? !actor,
          authorId: input.isAnonymous ? null : actor?.id ?? null,
          contactInfo: input.contactInfo ?? null,
          trackingCode: generateTrackingCode(),
        },
      });
    } catch (e) {
      const isUniqueViolation = e instanceof Error && "code" in e && (e as { code?: string }).code === "P2002";
      if (!isUniqueViolation || attempt === 4) throw e;
    }
  }
  throw new Error("Gagal membuat kode pelacakan, silakan coba lagi.");
}

/**
 * Cek status tiket lewat kode pelacakan publik — TANPA otorisasi, karena ini
 * justru pengganti akses berbasis akun (lihat catatan di createSuggestion).
 * Hanya mengembalikan field yang aman ditampilkan ke publik (bukan `author`/
 * `handledBy`, yang membawa data staf internal).
 */
export async function getSuggestionByTrackingCode(code: string) {
  const normalized = normalizeTrackingCode(code);
  if (normalized.length !== 9) return null; // format "XXXX-XXXX" selalu 9 karakter

  return prisma.suggestionTicket.findUnique({
    where: { trackingCode: normalized },
    select: {
      trackingCode: true,
      subject: true,
      message: true,
      category: true,
      status: true,
      response: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function listSuggestions(actor: Actor, status?: string) {
  assertCan(actor.role, "HANDLE_SUGGESTIONS");
  return prisma.suggestionTicket.findMany({
    where: status ? { status } : undefined,
    // `select` eksplisit di kedua relasi — hasil ini diteruskan langsung ke
    // <SuggestionRow> (Client Component), jadi `author: true`/`handledBy: true`
    // polos akan menyematkan `passwordHash` pengirim & penanggap ke payload
    // RSC yang dikirim ke browser. Ditemukan & diperbaiki saat audit halaman
    // per peran (pola yang sama juga ditemukan di finance & events service).
    include: {
      author: { select: { id: true, name: true } },
      handledBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function respondToSuggestion(
  actor: Actor,
  input: { ticketId: string; response: string; status: "DITINDAKLANJUTI" | "SELESAI" }
) {
  assertCan(actor.role, "HANDLE_SUGGESTIONS");
  const ticket = await prisma.suggestionTicket.update({
    where: { id: input.ticketId },
    data: { response: input.response, status: input.status, handledById: actor.id },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "SUGGESTION_RESPOND",
    entityType: "SuggestionTicket",
    entityId: ticket.id,
    meta: { status: input.status },
  });
  return ticket;
}

/** Jamaah hanya boleh melihat tiket miliknya sendiri — isolasi data antar jamaah. */
export async function listOwnSuggestions(actor: Actor) {
  return prisma.suggestionTicket.findMany({
    where: { authorId: actor.id },
    orderBy: { createdAt: "desc" },
  });
}
