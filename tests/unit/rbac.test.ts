import { describe, expect, it } from "vitest";
import { can, assertCan, ForbiddenError, PERMISSIONS } from "@/lib/rbac";
import type { Role } from "@prisma/client";

const ALL_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "BENDAHARA", "JAMAAH"];

describe("rbac.can", () => {
  it("returns false when role is null/undefined (no session)", () => {
    expect(can(null, "VIEW_FINANCE")).toBe(false);
    expect(can(undefined, "MANAGE_USERS")).toBe(false);
  });

  it("only SUPER_ADMIN can manage users", () => {
    for (const role of ALL_ROLES) {
      expect(can(role, "MANAGE_USERS")).toBe(role === "SUPER_ADMIN");
    }
  });

  it("JAMAAH cannot record, approve, or void transactions", () => {
    expect(can("JAMAAH", "RECORD_TRANSACTION")).toBe(false);
    expect(can("JAMAAH", "APPROVE_TRANSACTION")).toBe(false);
    expect(can("JAMAAH", "VOID_TRANSACTION")).toBe(false);
  });

  it("BENDAHARA can record transactions but cannot approve or void them", () => {
    expect(can("BENDAHARA", "RECORD_TRANSACTION")).toBe(true);
    expect(can("BENDAHARA", "APPROVE_TRANSACTION")).toBe(false);
    expect(can("BENDAHARA", "VOID_TRANSACTION")).toBe(false);
  });

  it("only SUPER_ADMIN can void a transaction (financial integrity control)", () => {
    for (const role of ALL_ROLES) {
      expect(can(role, "VOID_TRANSACTION")).toBe(role === "SUPER_ADMIN");
    }
  });

  it("every permission grants at least one role and never grants JAMAAH admin powers", () => {
    const adminOnlyPermissions = Object.keys(PERMISSIONS).filter((p) => p !== "VIEW_DASHBOARD");
    for (const permission of adminOnlyPermissions) {
      const roles = PERMISSIONS[permission as keyof typeof PERMISSIONS];
      expect(roles.length).toBeGreaterThan(0);
    }
    // JAMAAH should never appear in a mutation-heavy permission meant for staff.
    expect(PERMISSIONS.MANAGE_USERS as readonly Role[]).not.toContain("JAMAAH");
    expect(PERMISSIONS.RECORD_TRANSACTION as readonly Role[]).not.toContain("JAMAAH");
    expect(PERMISSIONS.MANAGE_FOUNDATION_PROFILE as readonly Role[]).not.toContain("JAMAAH");
  });
});

describe("rbac.assertCan", () => {
  it("throws ForbiddenError for an unauthorized role", () => {
    expect(() => assertCan("JAMAAH", "MANAGE_USERS")).toThrow(ForbiddenError);
  });

  it("does not throw for an authorized role", () => {
    expect(() => assertCan("SUPER_ADMIN", "MANAGE_USERS")).not.toThrow();
  });

  it("ForbiddenError carries a 403 status for HTTP-layer handling", () => {
    try {
      assertCan("JAMAAH", "MANAGE_USERS");
      throw new Error("should not reach here");
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenError);
      expect((e as ForbiddenError).status).toBe(403);
    }
  });
});
