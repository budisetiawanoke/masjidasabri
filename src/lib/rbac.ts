import type { Role } from "@prisma/client";

/**
 * Definisi izin per peran — satu sumber kebenaran untuk otorisasi.
 * Dipakai baik di middleware (proteksi rute) maupun di server actions/services
 * (validasi ulang di server, tidak pernah percaya klien).
 */
export const PERMISSIONS = {
  MANAGE_USERS: ["SUPER_ADMIN"],
  VIEW_FINANCE: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"],
  RECORD_TRANSACTION: ["SUPER_ADMIN", "BENDAHARA"],
  APPROVE_TRANSACTION: ["SUPER_ADMIN", "ADMIN"],
  VOID_TRANSACTION: ["SUPER_ADMIN"],
  MANAGE_CATEGORIES: ["SUPER_ADMIN", "BENDAHARA"],
  MANAGE_EVENTS: ["SUPER_ADMIN", "ADMIN"],
  MANAGE_ANNOUNCEMENTS: ["SUPER_ADMIN", "ADMIN"],
  MANAGE_INVENTORY: ["SUPER_ADMIN", "ADMIN"],
  MANAGE_MEMBERS: ["SUPER_ADMIN", "ADMIN"],
  MANAGE_BOARD: ["SUPER_ADMIN", "ADMIN"],
  MANAGE_ZAKAT: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"],
  MANAGE_DONATIONS: ["SUPER_ADMIN", "ADMIN", "BENDAHARA"],
  MANAGE_FOUNDATION_PROFILE: ["SUPER_ADMIN"],
  HANDLE_SUGGESTIONS: ["SUPER_ADMIN", "ADMIN"],
  VIEW_DASHBOARD: ["SUPER_ADMIN", "ADMIN", "BENDAHARA", "JAMAAH"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export function assertCan(role: Role | undefined | null, permission: Permission): void {
  if (!can(role, permission)) {
    throw new ForbiddenError(
      `Peran "${role ?? "tanpa sesi"}" tidak memiliki izin "${permission}".`
    );
  }
}

export class ForbiddenError extends Error {
  status = 403;
}

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Pengurus",
  BENDAHARA: "Bendahara",
  JAMAAH: "Jamaah",
};
