"use client";

import OrderKanban from "@/components/Dashboard/Order/OrderKanban";
import OrderTable from "@/components/Dashboard/Order/OrderTable";
import { useState } from "react";
import { LuSquareKanban } from "react-icons/lu";
import { FaTableList } from "react-icons/fa6";
import { Tab, Tabs } from "@nextui-org/react";

export default function Orders() {
  const [selectedTab, setSelectedTab] = useState("table");

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
