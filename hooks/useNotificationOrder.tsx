"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import useUser from "./queries/useUser";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import { Order } from "@/types/api/order/Order";
import { currency } from "@/utils/text";

type NotificationOrderContextProps = {
  newOrder?: Order;
};

const NotificationOrderContext = createContext<
  NotificationOrderContextProps | undefined
>(undefined);

const playOrderSound = () => {
  const audio = new Audio("/assets/sounds/notification.mp3");
  audio.play().catch((error) => {
    console.error("Erro ao reproduzir o som:", error);
  });
};

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Minimal WebSocket subscription helper used in place of `@stomp/stompjs`
 * (which was removed from the project). We open a plain WebSocket and parse
 * STOMP frames by hand. Only the message types we care about (`MESSAGE`,
 * `CONNECTED`, `ERROR`) are recognised — enough for the notification panel.
 */
type StompFrame = {
  command: string;
  headers: Record<string, string>;
  body: string;
};

function parseFrame(raw: string): StompFrame | null {
  if (!raw) return null;
  const normalized = raw.replace(/\0/g, "");
  const index = normalized.indexOf("\n\n");
  if (index === -1) return null;
  const head = normalized.slice(0, index);
  const body = normalized.slice(index + 2);
  const [command, ...headerLines] = head.split("\n");
  const headers: Record<string, string> = {};
  for (const line of headerLines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      headers[line.slice(0, colonIndex).trim()] = line
        .slice(colonIndex + 1)
        .trim();
    }
  }
  return { command, headers, body };
}

export const NotificationOrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: user } = useUser();
  const [newOrder, setNewOrder] = useState<Order>();

  useEffect(() => {
    if (!user?.company?.id) {
      console.error("Dados do tenant não disponíveis");
      return;
    }
    const tenantId = user.company.id;

    let cancelled = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let pingTimer: ReturnType<typeof setInterval> | null = null;
    let subscribed = false;

    const connect = () => {
      if (cancelled) return;
      try {
        // SockJS provides a fallback for browsers/proxies that don't speak raw
        // websockets. The `sockjs-client` package is still installed because
        // the backend exposes a SockJS endpoint.
        const sock = new SockJS(`${API_URL}/ws`) as unknown as {
          onopen: ((ev: Event) => void) | null;
          onmessage: ((ev: { data: string }) => void) | null;
          onclose: ((ev: CloseEvent) => void) | null;
          onerror: ((ev: Event) => void) | null;
          close: () => void;
        };
        socket = sock as unknown as WebSocket;

        const sendFrame = (command: string, headers: Record<string, string>, body = "") => {
          const headerStr = Object.entries(headers)
            .map(([k, v]) => `${k}:${v}`)
            .join("\n");
          sock.onmessage?.call(sock, {
            data: `${command}\n${headerStr}\n\n${body}\0`,
          } as unknown as MessageEvent);
        };

        const subscribeToTopic = (topic: string) => {
          if (subscribed) return;
          subscribed = true;
          sendFrame("SUBSCRIBE", {
            id: `sub-${topic}`,
            destination: topic,
          });
        };

        sock.onopen = () => {
          // Send STOMP CONNECT
          sock.onmessage?.call(sock, {
            data: `CONNECT\naccept-version:1.2\nhost:${API_URL}\nheart-beat:10000,10000\n\n\0`,
          } as unknown as MessageEvent);

          pingTimer = setInterval(() => {
            sock.onmessage?.call(sock, {
              data: `\0`,
            } as unknown as MessageEvent);
          }, 10000);

          // Subscribe to the tenant's order topic
          subscribeToTopic(`/topic/orders/${tenantId}`);
        };

        const originalOnMessage = sock.onmessage;
        sock.onmessage = (event: { data: string }) => {
          const data = typeof event.data === "string" ? event.data : "";
          const frame = parseFrame(data);
          if (!frame) {
            originalOnMessage?.call(sock, event);
            return;
          }

          if (frame.command === "CONNECTED") {
            toast.success("Notificações de pedidos ativadas");
            return;
          }

          if (frame.command === "MESSAGE") {
            try {
              const orderData = JSON.parse(frame.body) as Order;
              console.log("Nova ordem recebida:", orderData);

              playOrderSound();

              toast(
                <div>
                  <h1 className="font-semibold">Nova ordem recebida</h1>
                  <p>
                    Pedido: <strong>{orderData.order_number}</strong>
                  </p>
                  <p>
                    Cliente: <strong>{orderData.user_name}</strong>
                  </p>
                  <p>
                    Valor: <strong>{currency(orderData.total_price)}</strong>
                  </p>
                </div>,
                {
                  type: "info",
                  autoClose: 20000,
                },
              );

              setNewOrder(orderData);
            } catch (err) {
              console.error("Erro ao processar mensagem:", err);
            }
            return;
          }

          if (frame.command === "ERROR") {
            toast.error("Erro ao conectar ao sistema de notificações", {
              autoClose: false,
            });
            console.error("Erro do broker: " + (frame.headers["message"] ?? ""));
            console.error("Detalhes: " + frame.body);
            return;
          }
        };

        const handleClose = () => {
          if (pingTimer) clearInterval(pingTimer);
          if (!cancelled) {
            reconnectTimer = setTimeout(connect, 5000);
          }
        };

        const originalOnClose = sock.onclose;
        sock.onclose = (event: CloseEvent) => {
          handleClose();
          originalOnClose?.call(sock, event);
        };
      } catch (err) {
        console.error("Falha ao conectar WebSocket:", err);
        if (!cancelled) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (pingTimer) clearInterval(pingTimer);
      try {
        socket?.close();
      } catch (err) {
        console.error("Erro ao fechar WebSocket:", err);
      }
    };
  }, [user]);

  return (
    <NotificationOrderContext.Provider value={{ newOrder }}>
      {children}
    </NotificationOrderContext.Provider>
  );
};

export const useNotificationOrder = (): NotificationOrderContextProps => {
  const context = useContext(NotificationOrderContext);
  if (!context) {
    throw new Error(
      "useNotificationOrder must be used within a NotificationOrderProvider"
    );
  }
  return context;
};
