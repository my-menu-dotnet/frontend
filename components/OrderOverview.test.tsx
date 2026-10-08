import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import OrderOverview from "./OrderOverview";
import { currency } from "@/utils/text";
import type { FoodOrder } from "@/hooks/useCart";

const makeItem = (overrides: Partial<FoodOrder> = {}): FoodOrder => ({
  id: "i1",
  itemId: "i1",
  quantity: 1,
  image: "",
  title: "Pizza",
  description: "",
  price: 50,
  items: [],
  ...overrides,
});

describe("OrderOverview", () => {
  it("renders the section title", () => {
    const { container } = render(<OrderOverview items={[]} />);
    expect(container.textContent).toContain("Resumo do pedido");
  });

  it("shows R$ 0,00 for all totals when items is empty", () => {
    const { container } = render(<OrderOverview items={[]} />);
    const zero = currency(0);
    expect(container.textContent).toContain(zero);
  });

  it("shows subtotal as sum of price * quantity without discount", () => {
    const items = [
      makeItem({ id: "a", price: 30, quantity: 2 }),
      makeItem({ id: "b", price: 10, quantity: 1 }),
    ];
    const { container } = render(<OrderOverview items={items} />);
    expect(container.textContent).toContain("Subtotal");
    expect(container.textContent).toContain(currency(70));
  });

  it("shows discount line with '- ' prefix", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 20, type: "PERCENTAGE" },
      }),
    ];
    const { container } = render(<OrderOverview items={items} />);
    expect(container.textContent).toContain("Descontos");
    expect(container.textContent).toContain(`- ${currency(20)}`);
  });

  it("shows total as subtotal minus discount", () => {
    const items = [
      makeItem({
        id: "a",
        price: 100,
        quantity: 1,
        discount: { discount: 20, type: "PERCENTAGE" },
      }),
    ];
    const { container } = render(<OrderOverview items={items} />);
    expect(container.textContent).toContain("Total");
    expect(container.textContent).toContain(currency(80));
  });

  it("shows 0 discount when no item has a discount", () => {
    const items = [makeItem({ id: "a", price: 50, quantity: 1 })];
    const { container } = render(<OrderOverview items={items} />);
    expect(container.textContent).toContain(`- ${currency(0)}`);
  });

  it("shows subtotal equal to total when no discounts apply", () => {
    const items = [
      makeItem({ id: "a", price: 25, quantity: 1 }),
      makeItem({ id: "b", price: 15, quantity: 2 }),
    ];
    const { container } = render(<OrderOverview items={items} />);
    const expected = currency(55);
    expect(container.textContent).toContain(`Subtotal${expected}`);
    expect(container.textContent).toContain(`Total${expected}`);
  });
});
