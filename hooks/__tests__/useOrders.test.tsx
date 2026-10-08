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

describe("useOrders", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches paginated orders", async () => {
    const orders = factory.orderList(3);
    server.use(
      http.get("https://api.my-menu.net/order", () =>
        HttpResponse.json({ content: orders, page: 0, pageCount: 1, totalElements: 3 })
      )
    );

    const useOrders = (await import("../queries/order/useOrders")).default;
    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content).toHaveLength(3);
  });

  it("returns empty content when no orders exist", async () => {
    server.use(
      http.get("https://api.my-menu.net/order", () =>
        HttpResponse.json({ content: [], page: 0, pageCount: 0, totalElements: 0 })
      )
    );

    const useOrders = (await import("../queries/order/useOrders")).default;
    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content).toEqual([]);
  });
});

describe("useOrdersKanban", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches orders grouped by status", async () => {
    const useOrdersKanban = (await import("../queries/order/useOrdersKanban")).default;
    const { result } = renderHook(() => useOrdersKanban(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const data = result.current.data as Record<string, unknown[]>;
    expect(data.PENDING).toBeDefined();
    expect(data.PREPARING).toBeDefined();
    expect(data.READY).toEqual([]);
    expect(data.DELIVERED).toBeDefined();
  });
});

describe("useOrderUserTotal", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches total orders for the current user", async () => {
    server.use(
      http.get("https://api.my-menu.net/order/user/total", () =>
        HttpResponse.json({ total: 42 })
      )
    );

    const useOrderUserTotal = (await import("../queries/order/useOrderUserTotal")).default;
    const { result } = renderHook(() => useOrderUserTotal(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.total).toBe(42);
  });
});
