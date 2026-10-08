import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, type FoodOrder } from "./useCart";

vi.mock("@tanstack/react-router", () => ({
  useParams: () => ({ id: "test-menu-id" }),
}));

const makeItem = (overrides: Partial<FoodOrder> = {}): FoodOrder => ({
  id: "item-1",
  itemId: "item-1",
  quantity: 1,
  image: "https://example.com/x.png",
  title: "Pizza",
  description: "Delicious pizza",
  price: 29.9,
  items: [],
  ...overrides,
});

const renderUseCart = () =>
  renderHook(() => useCart(), { wrapper: CartProvider });

describe("useCart", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("throws if used outside CartProvider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within a CartProvider"
    );
  });

  it("starts with empty items", () => {
    const { result } = renderUseCart();
    expect(result.current.items).toEqual([]);
  });

  it("addItem appends to items", () => {
    const { result } = renderUseCart();
    act(() => result.current.addItem(makeItem({ id: "a" })));
    act(() => result.current.addItem(makeItem({ id: "b" })));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].id).toBe("a");
    expect(result.current.items[1].id).toBe("b");
  });

  it("addItemUnity increments quantity of matching item by 1", () => {
    const { result } = renderUseCart();
    act(() => result.current.addItem(makeItem({ id: "x", quantity: 2 })));
    act(() => result.current.addItemUnity("x"));
    expect(result.current.items[0].quantity).toBe(3);
  });

  it("addItemUnity increments quantity of matching sub-item by 1", () => {
    const { result } = renderUseCart();
    act(() =>
      result.current.addItem(
        makeItem({
          id: "parent",
          quantity: 1,
          items: [
            {
              id: "child",
              itemId: "child",
              quantity: 1,
              image: "i",
              title: "t",
              description: "d",
              price: 1,
              items: [],
            },
          ],
        })
      )
    );
    act(() => result.current.addItemUnity("child"));
    expect(result.current.items[0].items[0].quantity).toBe(2);
  });

  it("removeItemUnity decrements quantity by 1", () => {
    const { result } = renderUseCart();
    act(() => result.current.addItem(makeItem({ id: "x", quantity: 3 })));
    act(() => result.current.removeItemUnity("x"));
    expect(result.current.items[0].quantity).toBe(2);
  });

  it("removeItemUnity removes item when quantity drops to 0", () => {
    const { result } = renderUseCart();
    act(() => result.current.addItem(makeItem({ id: "x", quantity: 1 })));
    act(() => result.current.removeItemUnity("x"));
    expect(result.current.items).toHaveLength(0);
  });

  it("removeItemUnity removes sub-item when its quantity drops to 0", () => {
    const { result } = renderUseCart();
    act(() =>
      result.current.addItem(
        makeItem({
          id: "parent",
          quantity: 1,
          items: [
            {
              id: "child",
              itemId: "child",
              quantity: 1,
              image: "i",
              title: "t",
              description: "d",
              price: 1,
              items: [],
            },
          ],
        })
      )
    );
    act(() => result.current.removeItemUnity("child"));
    expect(result.current.items[0].items).toHaveLength(0);
  });

  it("removeItemUnity leaves other items untouched", () => {
    const { result } = renderUseCart();
    act(() => result.current.addItem(makeItem({ id: "a", quantity: 2 })));
    act(() => result.current.addItem(makeItem({ id: "b", quantity: 1 })));
    act(() => result.current.removeItemUnity("a"));
    expect(result.current.items[0].id).toBe("a");
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.items[1].id).toBe("b");
    expect(result.current.items[1].quantity).toBe(1);
  });

  it("removeItemUnity on unknown id is a no-op", () => {
    const { result } = renderUseCart();
    act(() => result.current.addItem(makeItem({ id: "a", quantity: 2 })));
    act(() => result.current.removeItemUnity("nope"));
    expect(result.current.items[0].quantity).toBe(2);
  });

  it("setItems replaces items array", () => {
    const { result } = renderUseCart();
    act(() => result.current.setItems([makeItem({ id: "z" })]));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe("z");
  });

  it("persists items to localStorage when items change", async () => {
    const { result } = renderUseCart();
    act(() => result.current.addItem(makeItem({ id: "persist" })));
    await new Promise((r) => setTimeout(r, 0));
    const stored = localStorage.getItem("cart");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed[0].id).toBe("persist");
  });
});
