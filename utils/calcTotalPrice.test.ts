import { describe, it, expect } from "vitest";
import {
  calcTotalPrice,
  calcTotalWithoutDiscount,
  calcTotalDiscount,
} from "./calcTotalPrice";
import type { FoodOrder } from "@/hooks/useCart";

const makeItem = (overrides: Partial<FoodOrder> = {}): FoodOrder => ({
  id: "item-1",
  itemId: "food-1",
  quantity: 1,
  image: "",
  title: "Pizza",
  description: "Tasty",
  price: 50,
  items: [],
  ...overrides,
});

describe("calcTotalPrice", () => {
  it("returns 0 for empty cart", () => {
    expect(calcTotalPrice([])).toBe(0);
  });

  it("sums price*quantity for items without sub-items or discount", () => {
    const items = [
      makeItem({ id: "a", price: 50, quantity: 2, items: [] }),
      makeItem({ id: "b", price: 30, quantity: 1, items: [] }),
    ];
    expect(calcTotalPrice(items)).toBe(130);
  });

  it("includes sub-items in total", () => {
    const items = [
      makeItem({
        id: "a",
        price: 50,
        quantity: 1,
        items: [
          makeItem({ id: "sa1", price: 10, quantity: 2 }),
          makeItem({ id: "sa2", price: 5, quantity: 1 }),
        ],
      }),
    ];
    // 50 + (10*2) + (5*1) = 75
    expect(calcTotalPrice(items)).toBe(75);
  });

  it("applies PERCENTAGE discount to parent item but not sub-items", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 10, type: "PERCENTAGE" },
        items: [makeItem({ id: "sa1", price: 20, quantity: 1 })],
      }),
    ];
    // (100 - 10%) = 90 + 20 (sub-item) = 110
    expect(calcTotalPrice(items)).toBe(110);
  });

  it("applies AMOUNT discount to parent item but not sub-items", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 25, type: "AMOUNT" },
        items: [makeItem({ id: "sa1", price: 20, quantity: 1 })],
      }),
    ];
    // (100 - 25) = 75 + 20 = 95
    expect(calcTotalPrice(items)).toBe(95);
  });

  it("ignores discount when discount value is 0", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 0, type: "PERCENTAGE" },
        items: [],
      }),
    ];
    expect(calcTotalPrice(items)).toBe(100);
  });

  it("applies discount per item independently", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 50, type: "AMOUNT" },
        items: [],
      }),
      makeItem({
        id: "b",
        price: 50,
        quantity: 2,
        discount: { discount: 10, type: "PERCENTAGE" },
        items: [],
      }),
    ];
    // (100 - 50) + (100 - 10%) = 50 + 90 = 140
    expect(calcTotalPrice(items)).toBe(140);
  });
});

describe("calcTotalWithoutDiscount", () => {
  it("returns 0 for empty cart", () => {
    expect(calcTotalWithoutDiscount([])).toBe(0);
  });

  it("sums price*quantity ignoring discount", () => {
    const items = [
      makeItem({ id: "a", price: 100, quantity: 1, items: [] }),
      makeItem({ id: "b", price: 50, quantity: 2, items: [] }),
    ];
    expect(calcTotalWithoutDiscount(items)).toBe(200);
  });

  it("includes sub-items", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        items: [makeItem({ id: "sa1", price: 10, quantity: 3 })],
      }),
    ];
    // 100 + 30 = 130
    expect(calcTotalWithoutDiscount(items)).toBe(130);
  });

  it("does NOT apply discount", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 50, type: "AMOUNT" },
        items: [],
      }),
    ];
    // would be 50 with discount, but is 100 without
    expect(calcTotalWithoutDiscount(items)).toBe(100);
  });
});

describe("calcTotalDiscount", () => {
  it("returns 0 for empty cart", () => {
    expect(calcTotalDiscount([])).toBe(0);
  });

  it("returns 0 when no items have discount", () => {
    const items = [
      makeItem({ id: "a", price: 100, quantity: 1, items: [] }),
    ];
    expect(calcTotalDiscount(items)).toBe(0);
  });

  it("returns discount amount for AMOUNT type", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 25, type: "AMOUNT" },
        items: [],
      }),
    ];
    expect(calcTotalDiscount(items)).toBe(25);
  });

  it("returns discount amount for PERCENTAGE type", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 10, type: "PERCENTAGE" },
        items: [],
      }),
    ];
    expect(calcTotalDiscount(items)).toBe(10);
  });

  it("does not include sub-items in discount calculation", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 25, type: "AMOUNT" },
        items: [makeItem({ id: "sa1", price: 50, quantity: 1 })],
      }),
    ];
    // Only parent discount: 25, sub-items are never discounted
    expect(calcTotalDiscount(items)).toBe(25);
  });

  it("PERCENTAGE discount scales with quantity", () => {
    const items = [
      makeItem({
        id: "a",
        price: 50,
        quantity: 3,
        discount: { discount: 10, type: "PERCENTAGE" },
        items: [],
      }),
    ];
    expect(calcTotalDiscount(items)).toBe(15);
  });

  it("AMOUNT discount is applied once regardless of quantity", () => {
    const items = [
      makeItem({
        id: "a",
        price: 50,
        quantity: 3,
        discount: { discount: 10, type: "AMOUNT" },
        items: [],
      }),
    ];
    expect(calcTotalDiscount(items)).toBe(10);
  });
});
