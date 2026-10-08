import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Price from "./Price";
import { currency } from "@/utils/text";

describe("Price", () => {
  it("renders formatted price when no discount is provided", () => {
    const { container } = render(<Price price={29.9} />);
    expect(container.textContent).toContain(currency(29.9));
  });

  it("does not show De/Por labels when no discount", () => {
    const { container } = render(<Price price={29.9} />);
    expect(container.textContent).not.toMatch(/De\s/);
    expect(container.textContent).not.toMatch(/Por\s/);
  });

  it("renders De/Por with PERCENTAGE discount", () => {
    const { container } = render(
      <Price
        price={100}
        discount={{ discount: 20, type: "PERCENTAGE" }}
      />
    );
    expect(container.textContent).toContain(`De ${currency(100)}`);
    expect(container.textContent).toContain(`Por ${currency(80)}`);
  });

  it("renders De/Por with AMOUNT discount", () => {
    const { container } = render(
      <Price
        price={50}
        discount={{ discount: 10, type: "AMOUNT" }}
      />
    );
    expect(container.textContent).toContain(`De ${currency(50)}`);
    expect(container.textContent).toContain(`Por ${currency(40)}`);
  });

  it("shows percentage badge with 'X%' for PERCENTAGE discount", () => {
    const { container } = render(
      <Price
        price={100}
        discount={{ discount: 25, type: "PERCENTAGE" }}
      />
    );
    expect(container.textContent).toContain("25%");
  });

  it("shows currency badge for AMOUNT discount", () => {
    const { container } = render(
      <Price
        price={100}
        discount={{ discount: 15, type: "AMOUNT" }}
      />
    );
    expect(container.textContent).toContain(currency(15));
  });

  it("hides discount badge when discountIcon is false", () => {
    const { container } = render(
      <Price
        price={100}
        discount={{ discount: 20, type: "PERCENTAGE" }}
        discountIcon={false}
      />
    );
    expect(container.textContent).not.toContain("20%");
  });

  it("shows discount badge by default", () => {
    const { container } = render(
      <Price
        price={100}
        discount={{ discount: 20, type: "PERCENTAGE" }}
      />
    );
    expect(container.textContent).toContain("20%");
  });

  it("applies custom discountColor to --discount-color CSS variable", () => {
    const { container } = render(
      <Price
        price={100}
        discount={{ discount: 20, type: "PERCENTAGE" }}
        discountColor="rgb(255, 0, 0)"
      />
    );
    const badge = container.querySelector(".discount-icon") as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge.style.getPropertyValue("--discount-color")).toBe("rgb(255, 0, 0)");
  });

  it("does not render discount section when discount value is 0", () => {
    const { container } = render(
      <Price
        price={100}
        discount={{ discount: 0, type: "PERCENTAGE" }}
      />
    );
    expect(container.textContent).not.toMatch(/De\s/);
    expect(container.textContent).toContain(currency(100));
  });
});
