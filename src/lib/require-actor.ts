import "server-only";
import { auth } from "@/lib/auth";
import { assertCan, type Permission } from "@/lib/rbac";

/**
 * Ambil actor (id + role) dari sesi server saat ini. Dipakai di setiap server
 * action dashboard — tidak pernah mempercayai role yang dikirim dari klien.
 */
export async function requireActor() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sesi tidak ditemukan. Silakan masuk kembali.");
  }
  return { id: session.user.id, role: session.user.role };
}

/**
 * Dipanggil di root Server Component tiap halaman dashboard yang menampilkan
 * data sensitif, agar akses ditolak di server terlepas dari apakah tautan
 * menu disembunyikan di UI. Middleware hanya memastikan ada sesi — bukan
 * bahwa role sesi berhak atas modul tertentu, jadi setiap halaman modul WAJIB
 * memanggil ini sendiri (pertahanan berlapis, tidak cukup hanya server action).
 */
export async function requirePagePermission(permission: Permission) {
  const actor = await requireActor();
  assertCan(actor.role, permission);
  return actor;
}
