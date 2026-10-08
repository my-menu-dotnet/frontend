import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useEffect } from "react";
import Header from "@/components/Menu/Header";
import Banners from "@/components/Menu/Banners";
import FoodList from "@/components/Menu/FoodList";
import BottomBar from "@/components/Menu/BottomBar";
import { postCompanyAccess } from "../server/menu";
import { Menu } from "@/types/api/Menu";

export const Route = createFileRoute("/menu/$id/")({
  component: MenuPage,
});

function MenuPage() {
  const menu = useLoaderData({ from: "/menu/$id" }) as Menu;
  const color = menu.company.primary_color || "#000";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    postCompanyAccess({
      data: {
        company_id: menu.company.id,
        access_way: params.get("access_way") || "WEB",
      },
    });
  }, [menu.company.id]);

  return (
    <div className="min-h-screen">
      <Header menu={menu} color={color} />
      <main className="flex flex-col w-full items-center px-4">
        <div className="max-w-[1200px] w-full">
          <Banners menu={menu} />
          <FoodList menu={menu} color={color} />
        </div>
      </main>
      <BottomBar />
    </div>
  );
}
