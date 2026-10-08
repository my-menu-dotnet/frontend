import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    className,
    target,
    hash,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
    target?: string;
    hash?: string;
  }) => (
    <a href={to + (hash ? `#${hash}` : "")} className={className} target={target}>
      {children}
    </a>
  ),
}));

import NavLink from "./NavLink";

describe("NavLink", () => {
  it("renders a plain <a> tag for external http:// URLs", () => {
    render(<NavLink to="http://example.com">External</NavLink>);
    const a = document.body.querySelector("a");
    expect(a).not.toBeNull();
    expect(a!.getAttribute("href")).toBe("http://example.com");
  });

  it("renders a plain <a> tag for external https:// URLs", () => {
    render(<NavLink to="https://example.com/page">External</NavLink>);
    const a = document.body.querySelector("a");
    expect(a).not.toBeNull();
    expect(a!.getAttribute("href")).toBe("https://example.com/page");
  });

  it("renders a plain <a> tag for mailto: links", () => {
    render(<NavLink to="mailto:hello@example.com">Email</NavLink>);
    const a = document.body.querySelector("a");
    expect(a).not.toBeNull();
    expect(a!.getAttribute("href")).toBe("mailto:hello@example.com");
  });

  it("renders a plain <a> tag for tel: links", () => {
    render(<NavLink to="tel:+5511999999999">Call</NavLink>);
    const a = document.body.querySelector("a");
    expect(a).not.toBeNull();
    expect(a!.getAttribute("href")).toBe("tel:+5511999999999");
  });

  it("forwards target attribute for external links", () => {
    render(
      <NavLink to="https://example.com" target="_blank">
        External
      </NavLink>
    );
    const a = document.body.querySelector("a");
    expect(a!.getAttribute("target")).toBe("_blank");
  });

  it("renders an <a> tag for internal routes (TanStack Link)", () => {
    render(<NavLink to="/auth">Login</NavLink>);
    const a = document.body.querySelector("a");
    expect(a).not.toBeNull();
    expect(a!.getAttribute("href")).toBe("/auth");
  });

  it("forwards className to the inner <a> for external links", () => {
    const { container } = render(
      <NavLink to="https://example.com" className="text-red-500">
        External
      </NavLink>
    );
    const a = container.querySelector("a");
    expect(a?.className).toContain("text-red-500");
  });

  it("renders the children inside the link", () => {
    render(<NavLink to="/dashboard">My Dashboard</NavLink>);
    expect(screen.getByText("My Dashboard")).toBeInTheDocument();
  });

  it("wraps the link inside a Button element", () => {
    const { container } = render(
      <NavLink to="https://example.com">External</NavLink>
    );
    const button = container.querySelector('[data-slot="button"]');
    expect(button).not.toBeNull();
    expect(button!.querySelector("a")).not.toBeNull();
  });

  it("forwards buttonProps to the wrapper Button", () => {
    const { container } = render(
      <NavLink
        to="https://example.com"
        buttonProps={{ variant: "destructive" }}
      >
        External
      </NavLink>
    );
    const button = container.querySelector('[data-slot="button"]');
    expect(button?.getAttribute("data-variant")).toBe("destructive");
  });
});
