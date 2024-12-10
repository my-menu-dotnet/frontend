"use client";

import menus from "@/utils/menus";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function Header() {
  const pathName = usePathname();

  const current = useMemo(() => {
    const list = menus.reduce((acc, item) => {
      if (item.children) {
        item.children.forEach((child) => {
          acc[child.to!] = child.title;
        });
      }

      acc[item.to!] = item.title;

      return acc;
    }, {} as Record<string, string>);
    return list;
  }, []);

  return (
    <header className="px-4 h-12 border-b-1 mb-4">
      <div className="">
        <h1 className="text-xl font-semibold">
          {current[pathName as keyof typeof current]}
        </h1>
      </div>
    </header>
  );
}
