import { describe, expect, it } from "vitest";
import { isRateLimited, recordFailedAttempt } from "@/lib/rate-limit";

describe("rate-limit", () => {
  it("does not rate-limit a key that has never failed", () => {
    expect(isRateLimited("login:never-tried@example.com")).toBe(false);
  });

  it("stays unblocked through many checks alone — only recordFailedAttempt adds to the count", () => {
    const key = "login:many-successful-checks@example.com";
    for (let i = 0; i < 50; i++) {
      expect(isRateLimited(key)).toBe(false);
    }
  });

  it("blocks only after the failure threshold is crossed, not before", () => {
    const key = `login:threshold-${Date.now()}@example.com`;
    for (let i = 0; i < 9; i++) {
      recordFailedAttempt(key);
      expect(isRateLimited(key)).toBe(false);
    }
    recordFailedAttempt(key); // 10th failure
    expect(isRateLimited(key)).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `login:a-${Date.now()}@example.com`;
    const keyB = `login:b-${Date.now()}@example.com`;
    for (let i = 0; i < 10; i++) recordFailedAttempt(keyA);
    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
