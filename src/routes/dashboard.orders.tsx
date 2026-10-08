import OrderKanban from "@/components/Dashboard/Order/OrderKanban";
import OrderTable from "@/components/Dashboard/Order/OrderTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { LuSquareKanban } from "react-icons/lu";
import { FaTableList } from "react-icons/fa6";
import OrderCreate from "@/components/Dashboard/Order/components/OrderCreate";
import { createFileRoute } from "@tanstack/react-router";
import Block from "@/components/Block";

export const Route = createFileRoute("/dashboard/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("table");

  return (
    <Block>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold">Pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe e gerencie os pedidos em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="table" className="gap-2">
                <FaTableList />
                <span className="hidden sm:inline">Tabela</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-2">
                <LuSquareKanban />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <OrderCreate />
        </div>
      </div>

      <div className="w-full">
        {selectedTab === "table" ? <OrderTable /> : <OrderKanban />}
      </div>
    </Block>
  );
}
