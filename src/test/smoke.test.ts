import { describe, it, expect } from "vitest";
import { factory } from "./factories";

describe("test infrastructure smoke", () => {
  it("factory generates unique IDs", () => {
    const a = factory.company();
    const b = factory.company();
    expect(a.id).not.toBe(b.id);
  });

  it("factory accepts overrides", () => {
    const c = factory.company({ name: "Custom" });
    expect(c.name).toBe("Custom");
  });

  it("factory menu contains categories and foods", () => {
    const m = factory.menu();
    expect(m.categories.length).toBeGreaterThan(0);
    expect(m.foods.length).toBeGreaterThan(0);
  });

  it("factory generates realistic order totals", () => {
    const o = factory.order();
    expect(o.total).toBeGreaterThan(0);
    expect(o.items.length).toBeGreaterThan(0);
  });
});
