"use client";

import menus, { PageMenus } from "@/utils/menus";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function Header() {
  const pathName = usePathname();

  const current = useMemo(() => {
    const list = menus.reduce((acc, item) => {
      if (item.children) {
        item.children.forEach((child) => {
          acc[child.to!] = child;
        });
      }

      acc[item.to!] = item;

      return acc;
    }, {} as Record<string, PageMenus>);
    return list;
  }, []);

  return (
    <header className="mb-4 bg-white p-6">
      <div className="ml-[80px]">
        {/* <p className="text-sm text-gray-500 flex gap-2 items-center mb-4">
          <FaLongArrowAltLeft />
          Voltar
        </p> */}
        <h1 className="text-lg">
          {current[pathName as keyof typeof current].title}
        </h1>
        <h2 className="text-gray-400 text-sm">{current[pathName as keyof typeof current].description}</h2>
      </div>
    </header>
  );
}
