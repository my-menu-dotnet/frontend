import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationOrderProvider, useNotificationOrder } from "./useNotificationOrder";

type FakeSocket = {
  readyState: number; send: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn>;
  onopen?: () => void; onmessage?: (event: { data: string }) => void; onclose?: (event: { code: number }) => void;
};
const state = vi.hoisted(() => ({ tenant: "tenant-a", sockets: [] as FakeSocket[] }));
vi.mock("./queries/useUser", () => ({ default: () => ({ data: { company: { id: state.tenant } } }) }));
vi.mock("sockjs-client", () => ({ default: class {
  readyState = 0;
  send = vi.fn();
  onopen?: () => void;
  onmessage?: (event: { data: string }) => void;
  onclose?: (event: { code: number }) => void;
  close = vi.fn(() => { this.readyState = 3; this.onclose?.({ code: 1000 }); });
  constructor() { state.sockets.push(this); }
} }));
vi.mock("react-toastify", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));

function Consumer() {
  const { newOrder } = useNotificationOrder();
  return <output>{newOrder?.order_number ?? "Nenhum pedido"}</output>;
}
async function connect(index = 0) {
  await waitFor(() => expect(state.sockets).toHaveLength(index + 1));
  const socket = state.sockets[index];
  act(() => { socket.readyState = 1; socket.onopen?.(); });
  expect(socket.send).toHaveBeenCalledWith(expect.stringMatching(/^CONNECT\n/));
  act(() => { socket.onmessage?.({ data: "CONNECTED\nversion:1.2\nheart-beat:0,0\n\n\0" }); });
  return socket;
}
beforeEach(() => { state.tenant = "tenant-a"; state.sockets = []; });
afterEach(() => { vi.useRealTimers(); });

describe("order notifications", () => {
  it("sends STOMP frames over the socket and exposes a received tenant order", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    render(<NotificationOrderProvider><Consumer /></NotificationOrderProvider>);
    const socket = await connect();
    const frame = socket.send.mock.calls.map(([data]) => String(data)).find(data => data.startsWith("SUBSCRIBE"));
    expect(frame).toContain("destination:/topic/orders/tenant-a\n");
    expect(socket.send).toHaveBeenCalledWith(expect.stringContaining("destination:/app/orders\n"));
    const subscription = frame!.match(/\nid:([^\n]+)/)![1];
    const body = JSON.stringify({ order_number: "42", user_name: "Ana", total_price: 20 });
    act(() => { socket.onmessage?.({ data: `MESSAGE\nsubscription:${subscription}\nmessage-id:1\ndestination:/topic/orders/tenant-a\n\n${body}\0` }); });
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("resubscribes after disconnect and cancels reconnect on unmount", async () => {
    const { unmount } = render(<NotificationOrderProvider><Consumer /></NotificationOrderProvider>);
    const first = await connect();
    vi.useFakeTimers();
    act(() => { first.readyState = 3; first.onclose?.({ code: 1006 }); });
    await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
    const second = state.sockets[1];
    expect(second).toBeDefined();
    act(() => { second.readyState = 1; second.onopen?.();
      second.onmessage?.({ data: "CONNECTED\nversion:1.2\nheart-beat:0,0\n\n\0" }); });
    expect(second.send).toHaveBeenCalledWith(expect.stringContaining("destination:/topic/orders/tenant-a\n"));
    expect(second.send).toHaveBeenCalledWith(expect.stringContaining("destination:/app/orders\n"));
    unmount();
    await act(async () => { await vi.advanceTimersByTimeAsync(10000); });
    expect(state.sockets).toHaveLength(2);
    expect(second.close).toHaveBeenCalled();
  });

  it("closes the old connection and clears the last order on tenant change", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const { rerender } = render(<NotificationOrderProvider><Consumer /></NotificationOrderProvider>);
    const first = await connect();
    const subscription = first.send.mock.calls.map(([data]) => String(data)).find(data => data.startsWith("SUBSCRIBE"))!.match(/\nid:([^\n]+)/)![1];
    act(() => { first.onmessage?.({ data: `MESSAGE\nsubscription:${subscription}\nmessage-id:1\n\n{"order_number":"42","total_price":20}\0` }); });
    expect(screen.getByText("42")).toBeInTheDocument();
    state.tenant = "tenant-b";
    rerender(<NotificationOrderProvider><Consumer /></NotificationOrderProvider>);
    const second = await connect(1);
    expect(first.close).toHaveBeenCalled();
    expect(second.send).toHaveBeenCalledWith(expect.stringContaining("destination:/topic/orders/tenant-b\n"));
    expect(screen.getByText("Nenhum pedido")).toBeInTheDocument();
  });
});
