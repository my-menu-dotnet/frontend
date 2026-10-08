import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
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

describe("useUpdateCreateClient", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("creates a new client when no ID is provided", async () => {
    const client = factory.client({ name: "Novo Cliente" });
    server.use(
      http.post("https://api.my-menu.net/client", () => HttpResponse.json(client, { status: 201 }))
    );

    const useUpdateCreateClient = (await import("../mutate/useUpdateCreateClient")).default;
    const { result } = renderHook(() => useUpdateCreateClient(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ name: "Novo Cliente", email: "novo@example.com" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
  });

  it("updates an existing client when ID is provided", async () => {
    const client = factory.client({ id: "cli-1", name: "Cliente Atualizado" });
    server.use(
      http.put("https://api.my-menu.net/client/cli-1", () => HttpResponse.json(client))
    );

    const useUpdateCreateClient = (await import("../mutate/useUpdateCreateClient")).default;
    const { result } = renderHook(() => useUpdateCreateClient(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ id: "cli-1", name: "Cliente Atualizado", email: "updated@example.com" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
  });
});

describe("useDeleteClient", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("deletes a client successfully", async () => {
    server.use(
      http.delete("https://api.my-menu.net/client/cli-1", () => new HttpResponse(null, { status: 204 }))
    );

    const useDeleteClient = (await import("../mutate/useDeleteClient")).default;
    const { result } = renderHook(() => useDeleteClient(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate("cli-1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
  });
});

describe("useUpdateCreateBanner", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("creates a new banner when no ID is provided", async () => {
    const banner = factory.banner({ name: "Novo Banner" });
    server.use(
      http.post("https://api.my-menu.net/banner", () => HttpResponse.json(banner, { status: 201 }))
    );

    const useUpdateCreateBanner = (await import("../mutate/useUpdateCreateBanner")).default;
    const { result } = renderHook(() => useUpdateCreateBanner(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ name: "Novo Banner", imageUrl: "https://example.com/banner.jpg" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
  });
});

describe("useUpdateBusinessHours", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("updates business hours successfully", async () => {
    const hours = factory.businessHours();
    server.use(
      http.put("https://api.my-menu.net/company/business-hours", () => HttpResponse.json(hours))
    );

    const useUpdateBusinessHours = (await import("../mutate/useUpdateBusinessHours")).default;
    const { result } = renderHook(() => useUpdateBusinessHours(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate(hours);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
  });
});
