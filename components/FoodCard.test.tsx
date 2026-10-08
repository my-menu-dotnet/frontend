import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import FoodCard from "./FoodCard";
import { currency } from "@/utils/text";
import type { Food } from "@/types/api/Food";

const makeFood = (overrides: Partial<Food> = {}): Food =>
  ({
    id: "food-1",
    name: "Pizza Margherita",
    description: "Classic Italian pizza",
    price: 45,
    image: { url: "https://example.com/pizza.jpg" },
    active_discount: null,
    ...overrides,
  } as Food);

describe("FoodCard", () => {
  it("renders food name and description", () => {
    const { container } = render(<FoodCard food={makeFood()} />);
    expect(container.textContent).toContain("Pizza Margherita");
    expect(container.textContent).toContain("Classic Italian pizza");
  });

  it("renders formatted price", () => {
    const { container } = render(<FoodCard food={makeFood({ price: 45 })} />);
    expect(container.textContent).toContain(currency(45));
  });

  it("uses food.image.url when provided", () => {
    const { container } = render(
      <FoodCard food={makeFood({ image: { url: "https://example.com/pizza.jpg" } })} />
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("https://example.com/pizza.jpg");
  });

  it("falls back to default image when food.image is null", () => {
    const { container } = render(
      <FoodCard food={makeFood({ image: null as any })} />
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBeTruthy();
    expect(img?.getAttribute("src")).not.toBe("");
  });

  it("falls back to default image when food.image.url is empty", () => {
    const { container } = render(
      <FoodCard food={makeFood({ image: { url: "" } })} />
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBeTruthy();
    expect(img?.getAttribute("src")).not.toBe("");
  });

  it("sets id attribute to food.id", () => {
    const { container } = render(
      <FoodCard food={makeFood({ id: "abc-123" })} />
    );
    const li = container.querySelector("li");
    expect(li?.id).toBe("abc-123");
  });

  it("applies custom className", () => {
    const { container } = render(
      <FoodCard food={makeFood()} className="custom-card" />
    );
    const li = container.querySelector("li");
    expect(li?.className).toContain("custom-card");
  });

  it("forwards arbitrary HTML data attributes", () => {
    const { container } = render(
      <FoodCard food={makeFood()} data-testid="food-card" />
    );
    const li = container.querySelector("li");
    expect(li?.getAttribute("data-testid")).toBe("food-card");
  });

  it("renders De/Por with active discount", () => {
    const { container } = render(
      <FoodCard
        food={makeFood({
          price: 100,
          active_discount: { discount: 20, type: "PERCENTAGE" },
        })}
      />
    );
    expect(container.textContent).toContain(`De ${currency(100)}`);
    expect(container.textContent).toContain(`Por ${currency(80)}`);
  });

  it("forwards discountColor to the Price component's discount badge", () => {
    const { container } = render(
      <FoodCard
        food={makeFood({
          price: 100,
          active_discount: { discount: 20, type: "PERCENTAGE" },
        })}
        discountColor="rgb(0, 255, 0)"
      />
    );
    const badge = container.querySelector(".discount-icon") as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge.style.getPropertyValue("--discount-color")).toBe("rgb(0, 255, 0)");
  });
});
