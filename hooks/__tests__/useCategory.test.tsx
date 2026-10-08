import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { server } from "../../src/test/msw/server";
import { factory } from "../../src/test/factories";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    logger: { log: () => {}, warn: () => {}, error: () => {} },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCategory", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches the current user's company categories", async () => {
    server.use(
      http.get("https://api.my-menu.net/category/me", () =>
        HttpResponse.json([factory.category(), factory.category({ id: "cat-2", name: "Bebidas" })])
      )
    );

    const useCategory = (await import("../queries/useCategory")).default;
    const { result } = renderHook(() => useCategory(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].name).toBe("Pizzas");
  });

  it("returns empty array when company has no categories", async () => {
    server.use(
      http.get("https://api.my-menu.net/category/me", () => HttpResponse.json([]))
    );

    const useCategory = (await import("../queries/useCategory")).default;
    const { result } = renderHook(() => useCategory(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("fetches categories in the correct order", async () => {
    const categories = [
      factory.category({ id: "cat-1", name: "Pizzas", order: 1 }),
      factory.category({ id: "cat-2", name: "Bebidas", order: 2 }),
      factory.category({ id: "cat-3", name: "Sobremesas", order: 3 }),
    ];
    server.use(
      http.get("https://api.my-menu.net/category/me", () =>
        HttpResponse.json(categories)
      )
    );

    const useCategory = (await import("../queries/useCategory")).default;
    const { result } = renderHook(() => useCategory(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(3);
    expect(result.current.data?.[2].name).toBe("Sobremesas");
  });
});
