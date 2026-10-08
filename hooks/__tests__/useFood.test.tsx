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

describe("useFood", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches a single food by ID", async () => {
    const food = factory.food({ id: "food-42", name: "Pizza Calabresa" });
    server.use(
      http.get("https://api.my-menu.net/food/food-42", () => HttpResponse.json(food))
    );

    const useFood = (await import("../queries/food/useFood")).default;
    const { result } = renderHook(() => useFood("food-42"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("food-42");
    expect(result.current.data?.name).toBe("Pizza Calabresa");
    expect(result.current.data?.price).toBeGreaterThan(0);
  });

  it("fetches food with promotional price when present", async () => {
    const food = factory.food({ id: "food-promo", promotionalPrice: 29.9 });
    server.use(
      http.get("https://api.my-menu.net/food/food-promo", () => HttpResponse.json(food))
    );

    const useFood = (await import("../queries/food/useFood")).default;
    const { result } = renderHook(() => useFood("food-promo"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.promotionalPrice).toBe(29.9);
  });
});
