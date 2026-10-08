import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import SimpleFoodItem from "./SimpleFoodItem";

const renderItem = (
  props: Partial<React.ComponentProps<typeof SimpleFoodItem>> = {}
) =>
  render(
    <SimpleFoodItem
      title="Pizza"
      description="Delicious pizza"
      price={29.9}
      total={0}
      {...props}
    />
  );

describe("SimpleFoodItem", () => {
  it("renders title and description", () => {
    const { container } = renderItem();
    expect(container.textContent).toContain("Pizza");
    expect(container.textContent).toContain("Delicious pizza");
  });

  it("uses provided image when image prop is set", () => {
    const { container } = renderItem({ image: "https://example.com/pizza.png" });
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("https://example.com/pizza.png");
  });

  it("falls back to default food image when image is not provided", () => {
    const { container } = renderItem();
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBeTruthy();
    expect(img?.getAttribute("src")).not.toBe("");
  });

  it("renders formatted price when price > 0", () => {
    const { container } = renderItem({ price: 50 });
    expect(container.textContent).toContain("R$");
    expect(container.textContent).toContain("50,00");
  });

  it("does not render price section when price is 0", () => {
    const { container } = renderItem({ price: 0 });
    expect(container.textContent).not.toContain("R$");
  });

  it("does not render price section when price is undefined", () => {
    const { container } = renderItem({ price: undefined });
    expect(container.textContent).not.toContain("R$");
  });

  it("shows '+' prefix before price when hasIncrease=true (default)", () => {
    const { container } = renderItem({ price: 50, hasIncrease: true });
    expect(container.textContent).toMatch(/\+.*R\$/);
  });

  it("does not show '+' prefix when hasIncrease=false", () => {
    const { container } = renderItem({ price: 50, hasIncrease: false });
    expect(container.textContent).not.toMatch(/\+\s*R\$/);
  });

  it("renders quantity controls by default (hasChangeQuantity=true)", () => {
    const { container } = renderItem();
    expect(container.textContent).toContain("0");
  });

  it("hides quantity controls when hasChangeQuantity=false", () => {
    const { container } = renderItem({ hasChangeQuantity: false, total: 3 });
    expect(container.textContent).not.toContain("3");
  });

  it("renders the current total quantity", () => {
    const { container } = renderItem({ total: 5 });
    expect(container.textContent).toContain("5");
  });

  it("calls onClickAdd when plus button is clicked", () => {
    const onClickAdd = vi.fn();
    const { container } = renderItem({ onClickAdd });
    const plus = container.querySelector(".bg-gray-100") as HTMLElement;
    fireEvent.click(plus);
    expect(onClickAdd).toHaveBeenCalledTimes(1);
  });

  it("calls onClickRemove when minus button is clicked", () => {
    const onClickRemove = vi.fn();
    const { container } = renderItem({ onClickRemove });
    const buttons = container.querySelectorAll(".bg-gray-100");
    const minus = buttons[1] as HTMLElement;
    fireEvent.click(minus);
    expect(onClickRemove).toHaveBeenCalledTimes(1);
  });

  it("does not call onClickAdd when isDisabled=true", () => {
    const onClickAdd = vi.fn();
    const { container } = renderItem({ onClickAdd, isDisabled: true });
    const plus = container.querySelector(".bg-gray-100") as HTMLElement;
    fireEvent.click(plus);
    expect(onClickAdd).not.toHaveBeenCalled();
  });

  it("does not call onClickRemove when isDisabled=true", () => {
    const onClickRemove = vi.fn();
    const { container } = renderItem({ onClickRemove, isDisabled: true });
    const buttons = container.querySelectorAll(".bg-gray-100");
    const minus = buttons[1] as HTMLElement;
    fireEvent.click(minus);
    expect(onClickRemove).not.toHaveBeenCalled();
  });

  it("applies opacity-50 to quantity controls when isDisabled=true", () => {
    const { container } = renderItem({ isDisabled: true });
    const controls = container.querySelector(".opacity-50");
    expect(controls).not.toBeNull();
  });
});
