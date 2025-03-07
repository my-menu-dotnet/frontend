"use client";

import OrderKanban from "@/components/Dashboard/Order/OrderKanban";
import OrderTable from "@/components/Dashboard/Order/OrderTable";
import { useState } from "react";
import { LuSquareKanban } from "react-icons/lu";
import { FaTableList } from "react-icons/fa6";
import { Tab, Tabs } from "@nextui-org/react";
import OrderCreate from "@/components/Dashboard/Order/components/OrderCreate";

export default function Orders() {
  const [selectedTab, setSelectedTab] = useState("table");

  return (
    <div className="px-2">
      <div className="w-full flex gap-2">
        {selectedTab === "table" ? <OrderTable /> : <OrderKanban />}
        <div className="flex flex-col gap-2 items-center">
          <OrderCreate />
          <Tabs
            onSelectionChange={(key) => setSelectedTab(String(key))}
            selectedKey={selectedTab}
            isVertical
          >
            <Tab title={<FaTableList />} key="table" />
            <Tab title={<LuSquareKanban />} key="kanban" />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
