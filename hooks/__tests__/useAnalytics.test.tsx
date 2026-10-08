import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { server } from "../../src/test/msw/server";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    logger: { log: () => {}, warn: () => {}, error: () => {} },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCompanyAccess", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches total company access count", async () => {
    server.use(
      http.get("https://api.my-menu.net/analytics/company/total-access", () =>
        HttpResponse.json({ total: 256 })
      )
    );

    const useCompanyAccess = (await import("../queries/analytics/useCompanyAccess")).default;
    const { result } = renderHook(() => useCompanyAccess(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
    expect(result.current.data?.total).toBe(256);
  });
});

describe("useTotalOrders", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches total orders count", async () => {
    server.use(
      http.get("https://api.my-menu.net/analytics/orders/total", () =>
        HttpResponse.json({ total: 128 })
      )
    );

    const useTotalOrders = (await import("../queries/analytics/useTotalOrders")).default;
    const { result } = renderHook(() => useTotalOrders(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
    expect(result.current.data?.total).toBe(128);
  });
});

describe("useDailyStats", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches daily statistics with labels and data", async () => {
    const stats = { labels: ["Seg", "Ter"], data: [12, 19] };
    server.use(
      http.get("https://api.my-menu.net/analytics/orders/daily-stats", () =>
        HttpResponse.json(stats)
      )
    );

    const useDailyStats = (await import("../queries/analytics/useDailyStats")).default;
    const { result } = renderHook(() => useDailyStats(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
    expect(result.current.data?.labels).toHaveLength(2);
    expect(result.current.data?.data).toHaveLength(2);
  });
});

describe("useItemsStats", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches items statistics with custom months parameter", async () => {
    const stats = { labels: ["Pizza", "Refri"], data: [40, 25] };
    server.use(
      http.get("https://api.my-menu.net/analytics/orders/items-stats", () =>
        HttpResponse.json(stats)
      )
    );

    const useItemsStats = (await import("../queries/analytics/useItemsStats")).default;
    const { result } = renderHook(() => useItemsStats(6), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
    expect(result.current.data?.data[0]).toBe(40);
  });
});

describe("useCompleteAnalytics", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches complete analytics dashboard data", async () => {
    const complete = {
      totalOrders: 128,
      totalRevenue: 12800,
      averageOrderValue: 100,
      topItems: ["Pizza Margherita"],
      dailyStats: { labels: ["Seg"], data: [12] },
      itemsStats: { labels: ["Pizza"], data: [40] },
    };
    server.use(
      http.get("https://api.my-menu.net/analytics/orders/complete-analytics", () =>
        HttpResponse.json(complete)
      )
    );

    const useCompleteAnalytics = (await import("../queries/analytics/useCompleteAnalytics")).default;
    const { result } = renderHook(() => useCompleteAnalytics(3), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
    expect(result.current.data?.totalOrders).toBe(128);
    expect(result.current.data?.totalRevenue).toBe(12800);
  });
});
