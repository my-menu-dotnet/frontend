"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();

  const current = {
    "/dashboard": "Dashboard",
    "/dashboard/company": "Empresa",
    "/dashboard/menu": "Cardápio",
    "/dashboard/config": "Configurações",
    "/dashboard/profile": "Perfil",
  };

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
