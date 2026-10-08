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

describe("useBanners", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches paginated banners", async () => {
    const banners = [factory.banner(), factory.banner({ id: "ban-2" })];
    server.use(
      http.get("https://api.my-menu.net/banner", () =>
        HttpResponse.json({ content: banners, page: 0, pageCount: 1, totalElements: 2 })
      )
    );

    const useBanners = (await import("../queries/banner/useBanners")).default;
    const { result } = renderHook(() => useBanners(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content).toHaveLength(2);
  });

  it("returns empty content when no banners exist", async () => {
    server.use(
      http.get("https://api.my-menu.net/banner", () =>
        HttpResponse.json({ content: [], page: 0, pageCount: 0, totalElements: 0 })
      )
    );

    const useBanners = (await import("../queries/banner/useBanners")).default;
    const { result } = renderHook(() => useBanners(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content).toEqual([]);
  });
});

describe("useBanner (single)", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("fetches a single banner by ID", async () => {
    const banner = factory.banner({ id: "ban-1", name: "Promoção Especial" });
    server.use(
      http.get("https://api.my-menu.net/banner/ban-1", () => HttpResponse.json(banner))
    );

    const useBanner = (await import("../queries/banner/useBanner")).default;
    const { result } = renderHook(() => useBanner("ban-1"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe("Promoção Especial");
  });

  it("fetches inactive banner with active=false flag", async () => {
    const banner = factory.banner({ id: "ban-inactive", active: false });
    server.use(
      http.get("https://api.my-menu.net/banner/ban-inactive", () => HttpResponse.json(banner))
    );

    const useBanner = (await import("../queries/banner/useBanner")).default;
    const { result } = renderHook(() => useBanner("ban-inactive"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.active).toBe(false);
  });
});
