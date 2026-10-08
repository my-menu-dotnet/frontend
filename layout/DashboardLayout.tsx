"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Sidebar/Header";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
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
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-[80px] p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
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
