"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Sidebar/Header";
import { Drawer, DrawerContent } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-row flex-nowrap bg-[#F1F1F1]">
      {isMobile ? (
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="left"
        >
          <DrawerContent className="w-[80px]">
            <Sidebar />
          </DrawerContent>
        </Drawer>
      ) : (
        <Sidebar />
      )}
      <div className="w-full min-h-full" style={{ marginLeft: "80px" }}>
        <Header onClickMenu={() => setIsOpen(true)} />
        <section className="px-1 md:px-4">{children}</section>
      </div>
    </div>
  );
}
