import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NavLink from "../NavLink";

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<>{ui}</>);
};

describe("NavLink component", () => {
  it("renders external link with anchor tag for http URLs", () => {
    renderWithRouter(<NavLink to="https://example.com">External</NavLink>);
    const link = screen.getByText("External").closest("a");
    expect(link?.getAttribute("href")).toBe("https://example.com");
  });

  it("renders external link with anchor tag for mailto URLs", () => {
    renderWithRouter(<NavLink to="mailto:contact@example.com">Email us</NavLink>);
    const link = screen.getByText("Email us").closest("a");
    expect(link?.getAttribute("href")).toBe("mailto:contact@example.com");
  });

  it("passes target attribute for external links", () => {
    renderWithRouter(
      <NavLink to="https://example.com" target="_blank">
        External
      </NavLink>
    );
    const link = screen.getByText("External").closest("a");
    expect(link?.getAttribute("target")).toBe("_blank");
  });

  it("handles tel: links as external", () => {
    renderWithRouter(<NavLink to="tel:+5511999999999">Call us</NavLink>);
    const link = screen.getByText("Call us").closest("a");
    expect(link?.getAttribute("href")).toBe("tel:+5511999999999");
  });
});
