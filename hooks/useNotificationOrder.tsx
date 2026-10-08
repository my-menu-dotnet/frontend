"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import useUser from "./queries/useUser";
import { Client } from "@stomp/stompjs";
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

export const NotificationOrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: user } = useUser();
  const [newOrder, setNewOrder] = useState<Order>();

  const tenantId = user?.company?.id;

  useEffect(() => {
    setNewOrder(undefined);
    if (!tenantId) return;

    let cancelled = false;
    let client: Client | undefined;

    // SockJS is a browser transport. Keep it out of Worker module evaluation.
    void import("sockjs-client").then(({ default: SockJS }) => {
      if (cancelled) return;
      client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
          if (cancelled) return;
          client!.subscribe(`/topic/orders/${tenantId}`, (message) => {
            if (cancelled) return;
            try {
              const orderData = JSON.parse(message.body) as Order;
              playOrderSound();
              toast(
                <div>
                  <h1 className="font-semibold">Nova ordem recebida</h1>
                  <p>Pedido: <strong>{orderData.order_number}</strong></p>
                  <p>Cliente: <strong>{orderData.user_name}</strong></p>
                  <p>Valor: <strong>{currency(orderData.total_price)}</strong></p>
                </div>,
                { type: "info", autoClose: 20000 },
              );
              setNewOrder(orderData);
            } catch (error) {
              console.error("Erro ao processar mensagem de pedido:", error);
            }
          });
          // The backend registers this session before broadcasting tenant orders.
          client!.subscribe("/app/orders", () => {});
          toast.success("Notificações de pedidos ativadas");
        },
        onStompError: () => {
          if (!cancelled) {
            toast.error("Erro ao conectar ao sistema de notificações", { autoClose: false });
          }
        },
      });
      client.activate();
    }).catch((error) => {
      if (!cancelled) console.error("Falha ao carregar notificações:", error);
    });

    return () => {
      cancelled = true;
      void client?.deactivate({ force: true });
    };
  }, [tenantId]);

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
