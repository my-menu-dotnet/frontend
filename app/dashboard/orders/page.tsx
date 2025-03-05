"use client";

import Block from "@/components/Block";
import OrderKanban from "@/components/Dashboard/Order/OrderKanban";
import OrderTable from "@/components/Dashboard/Order/OrderTable";
import useOrders from "@/hooks/queries/order/useOrders";
import useUser from "@/hooks/queries/useUser";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { LuSquareKanban } from "react-icons/lu";
import { FaTableList } from "react-icons/fa6";
import { Tab, Tabs } from "@nextui-org/react";

export default function Orders() {
  const { data: user } = useUser();
  const { data: orders } = useOrders();
  const [selectedTab, setSelectedTab] = useState("table");

  useEffect(() => {
    // if (!user?.company?.id) {
    //   console.error("Dados do tenant não disponíveis");
    //   return;
    // }
    // const tenantId = user.company.id;
    // const socket = new SockJS("http://localhost:8080/ws");
    // const client = new Client({
    //   webSocketFactory: () => socket,
    //   reconnectDelay: 5000,
    //   heartbeatIncoming: 4000,
    //   heartbeatOutgoing: 4000,
    //   debug: (str) => {
    //     console.log(str);
    //   },
    //   onConnect: () => {
    //     console.log("Conectado ao WebSocket");
    //     client.subscribe(`/topic/orders/${tenantId}`, (message) => {
    //       const orderData = JSON.parse(message.body);
    //       console.log("Nova ordem recebida:", orderData);
    //     });
    //     client.subscribe(`/app/orders`, (message) => {
    //       const initialOrders = JSON.parse(message.body);
    //       console.log("Ordens iniciais recebidas:", initialOrders);
    //     });
    //   },
    //   onStompError: (frame) => {
    //     console.error("Erro do broker: " + frame.headers["message"]);
    //     console.error("Detalhes: " + frame.body);
    //   },
    // });
    // client.activate();
    // return () => {
    //   client.deactivate();
    // };
  }, [user]);

  return (
    <div className="px-2">
      <div className="w-full flex justify-end mb-2">
        <Tabs
          onSelectionChange={(key) => setSelectedTab(String(key))}
          selectedKey={selectedTab}
        >
          <Tab title={<FaTableList />} key="table" />
          <Tab title={<LuSquareKanban />} key="kanban" />
        </Tabs>
      </div>
      {selectedTab === "table" ? <OrderTable /> : <OrderKanban />}
    </div>
  );
}
