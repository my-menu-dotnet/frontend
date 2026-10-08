import { describe, it, expect } from "vitest";
import { calculateDiscount } from "./discount";

describe("calculateDiscount", () => {
  describe("when discount type is AMOUNT", () => {
    it("subtracts flat amount from price", () => {
      const result = calculateDiscount(
        { price: 100 },
        { discount: 20, type: "AMOUNT" }
      );
      expect(result).toBe(80);
    });

    it("returns negative value when discount exceeds price", () => {
      const result = calculateDiscount(
        { price: 10 },
        { discount: 50, type: "AMOUNT" }
      );
      expect(result).toBe(-40);
    });

    it("returns zero when discount equals price", () => {
      const result = calculateDiscount(
        { price: 50 },
        { discount: 50, type: "AMOUNT" }
      );
      expect(result).toBe(0);
    });
  });

  describe("when discount type is PERCENTAGE", () => {
    it("applies percentage discount", () => {
      const result = calculateDiscount(
        { price: 100 },
        { discount: 10, type: "PERCENTAGE" }
      );
      expect(result).toBe(90);
    });

    it("applies 50% discount correctly", () => {
      const result = calculateDiscount(
        { price: 200 },
        { discount: 50, type: "PERCENTAGE" }
      );
      expect(result).toBe(100);
    });

    it("applies 100% discount to reach zero", () => {
      const result = calculateDiscount(
        { price: 50 },
        { discount: 100, type: "PERCENTAGE" }
      );
      expect(result).toBe(0);
    });

    it("rounds based on arithmetic for fractional prices", () => {
      const result = calculateDiscount(
        { price: 33.33 },
        { discount: 10, type: "PERCENTAGE" }
      );
      expect(result).toBeCloseTo(29.997, 3);
    });
  });

  describe("edge cases", () => {
    it("handles zero discount (no-op for any type)", () => {
      expect(calculateDiscount({ price: 100 }, { discount: 0, type: "AMOUNT" })).toBe(100);
      expect(calculateDiscount({ price: 100 }, { discount: 0, type: "PERCENTAGE" })).toBe(100);
    });

    it("handles zero price", () => {
      expect(calculateDiscount({ price: 0 }, { discount: 50, type: "AMOUNT" })).toBe(-50);
      expect(calculateDiscount({ price: 0 }, { discount: 50, type: "PERCENTAGE" })).toBe(0);
    });
  });
});
