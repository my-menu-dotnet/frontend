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

describe("useMutationOrder", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("creates an order and returns the order data", async () => {
    const order = factory.order({ total: 150.5 });
    server.use(
      http.post("https://api.my-menu.net/order", () => HttpResponse.json(order, { status: 201 }))
    );

    const useMutationOrder = (await import("../mutate/useMutationOrder")).default;
    const { result } = renderHook(() => useMutationOrder(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({
        orderItemForm: [{ foodId: "food-1", quantity: 2, unitPrice: 50 } as never],
        total: 100,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
    expect(result.current.data?.total).toBe(150.5);
  });
});

describe("useMutationOrderAnonymous", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("creates an anonymous order without requiring user account", async () => {
    const order = factory.order({ userId: undefined });
    server.use(
      http.post("https://api.my-menu.net/order/anonymously", () =>
        HttpResponse.json(order, { status: 201 })
      )
    );

    const { useMutationOrderAnonymous } = await import("../mutate/useMutationOrderAnonymous");
    const { result } = renderHook(() => useMutationOrderAnonymous(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({
        user_name: "João",
        company_observation: "Sem cebola",
        order_items: [{ foodId: "food-1", quantity: 1, unitPrice: 50 } as never],
        address: { street: "Rua A", number: "1" },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
  });
});

describe("useMutationOrderStatus", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("updates order status successfully", async () => {
    const updated = factory.order({ id: "ord-1", status: "PREPARING" });
    server.use(
      http.patch("https://api.my-menu.net/order/ord-1", () => HttpResponse.json(updated))
    );

    const useMutationOrderStatus = (await import("../mutate/useMutationOrderStatus")).default;
    const { result } = renderHook(() => useMutationOrderStatus(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ orderId: "ord-1", new_order: 1, status: "PREPARING" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 });
    expect(result.current.data?.data?.status).toBe("PREPARING");
  });
});
