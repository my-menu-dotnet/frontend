import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { MenuCompanyProvider, useMenuCompany } from "./useMenuCompany";
import type { Company } from "@/types/api/Company";

const makeCompany = (overrides: Partial<Company> = {}): Company =>
  ({
    id: "company-1",
    name: "Acme",
    slug: "acme",
    ...overrides,
  } as Company);

const renderUseMenuCompany = (company = makeCompany()) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MenuCompanyProvider company={company}>{children}</MenuCompanyProvider>
  );
  return renderHook(() => useMenuCompany(), { wrapper });
};

describe("useMenuCompany", () => {
  it("throws if used outside MenuCompanyProvider", () => {
    expect(() => renderHook(() => useMenuCompany())).toThrow(
      "useMenuCompany must be used within a MenuCompanyProvider"
    );
  });

  it("returns the provided company on mount", () => {
    const company = makeCompany({ name: "Burger Place" });
    const { result } = renderUseMenuCompany(company);
    expect(result.current.company).toEqual(company);
  });

  it("setCompany updates the company in context", () => {
    const initial = makeCompany({ name: "Acme" });
    const updated = makeCompany({ id: "company-2", name: "Pizza Place" });
    const { result } = renderUseMenuCompany(initial);
    act(() => result.current.setCompany(updated));
    expect(result.current.company).toEqual(updated);
  });

  it("different providers have independent state", () => {
    const a = makeCompany({ name: "A" });
    const b = makeCompany({ name: "B" });
    const wrapperA = ({ children }: { children: React.ReactNode }) => (
      <MenuCompanyProvider company={a}>{children}</MenuCompanyProvider>
    );
    const wrapperB = ({ children }: { children: React.ReactNode }) => (
      <MenuCompanyProvider company={b}>{children}</MenuCompanyProvider>
    );
    const { result: resultA } = renderHook(() => useMenuCompany(), {
      wrapper: wrapperA,
    });
    const { result: resultB } = renderHook(() => useMenuCompany(), {
      wrapper: wrapperB,
    });
    expect(resultA.current.company.name).toBe("A");
    expect(resultB.current.company.name).toBe("B");
    act(() => resultA.current.setCompany(makeCompany({ name: "A2" })));
    expect(resultA.current.company.name).toBe("A2");
    expect(resultB.current.company.name).toBe("B");
  });
});
