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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const socket = new SockJS(`${API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log("Conectado ao WebSocket");

        toast.success("Notificações de pedidos ativadas");

        client.subscribe(`/topic/orders/${tenantId}`, (message) => {
          const orderData = JSON.parse(message.body) as Order;
          console.log("Nova ordem recebida:", orderData);

          playOrderSound();

          toast(
            <div>
              <h1 className="font-semibold">Nova ordem recebida</h1>
              <p>
                Pedido: <strong>{orderData.order_number}</strong>
              </p>
              <p>
                Cliente: <strong>{orderData.user.name}</strong>
              </p>
              <p>
                Valor: <strong>{currency(orderData.total_price)}</strong>
              </p>
            </div>,
            {
              type: "info",
              autoClose: 20000,
            }
          );

          setNewOrder(orderData);
        });
        client.subscribe(`/app/orders`, (message) => {
          const initialOrders = JSON.parse(message.body);
          console.log("Ordens iniciais recebidas:", initialOrders);
        });
      },
      onStompError: (frame) => {
        toast.error("Erro ao conectar ao sistema de notificações", {
          autoClose: false,
        });
        console.error("Erro do broker: " + frame.headers["message"]);
        console.error("Detalhes: " + frame.body);

        setTimeout(() => {
          client.activate();
        }, 5000);
      },
      onWebSocketClose: () => {
        toast.error("Conexão com o WebSocket fechada", {
          autoClose: false,
        });
        console.error("Conexão com o WebSocket fechada");

        setTimeout(() => {
          client.activate();
        }, 5000);
      },
      onDisconnect: () => {
        setTimeout(() => {
          client.activate();
        }, 5000);
      },
    });
    client.activate();
    return () => {
      client.deactivate();
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
