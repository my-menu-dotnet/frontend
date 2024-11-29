"use client";

import useUser from "@/hooks/queries/useUser";
import { usePathname } from "next/navigation";
import { CiBellOn } from "react-icons/ci";
import { GoPerson } from "react-icons/go";

export default function Header() {
  const { data: user } = useUser();
  const pathName = usePathname();

  const current = {
    "/dashboard": "Dashboard",
    "/dashboard/company": "Empresa",
    "/dashboard/menu": "Cardápio",
    "/dashboard/config": "Configurações",
  };

  return (
    <header className="px-4 h-12 border-b-1 mb-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-semibold">
          {current[pathName as keyof typeof current]}
        </h1>

        <div className="flex flex-row justify-center items-center gap-4">
          <CiBellOn size={24}/>
          <div className="bg-primary rounded-full p-1">
            <GoPerson size={24} color="white"/>
          </div>
        </div>
      </div>
    </header>
  );
}
