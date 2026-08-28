import { describe, expect, it } from "vitest";
import { calculateZakatMaal, calculateZakatFitrah } from "@/lib/zakat-calc";

describe("calculateZakatMaal", () => {
  it("is not obligatory below nisab (85gr gold)", () => {
    const result = calculateZakatMaal(10_000_000, 1_500_000); // nisab = 127.5jt
    expect(result.wajibZakat).toBe(false);
    expect(result.zakatAmount).toBe(0);
  });

  it("is obligatory at or above nisab and charges exactly 2.5%", () => {
    const goldPrice = 1_500_000;
    const nisab = goldPrice * 85;
    const result = calculateZakatMaal(nisab, goldPrice);
    expect(result.wajibZakat).toBe(true);
    expect(result.zakatAmount).toBe(Math.round(nisab * 0.025));
  });

  it("scales linearly with asset value above nisab", () => {
    const goldPrice = 1_500_000;
    const result = calculateZakatMaal(200_000_000, goldPrice);
    expect(result.zakatAmount).toBe(5_000_000);
  });
});

describe("calculateZakatFitrah", () => {
  it("uses 2.5kg of rice per family member", () => {
    const result = calculateZakatFitrah(4, 15_000);
    expect(result.riceKg).toBe(10);
    expect(result.moneyEquivalent).toBe(150_000);
  });

  it("handles a single payer", () => {
    const result = calculateZakatFitrah(1, 12_000);
    expect(result.riceKg).toBe(2.5);
    expect(result.moneyEquivalent).toBe(30_000);
  });
});
