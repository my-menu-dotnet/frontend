"use client";

import { IconType } from "react-icons/lib";
import { FiHome } from "react-icons/fi";
import { MdOutlineFastfood, MdStorefront, MdWallpaper } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { TbCategoryPlus } from "react-icons/tb";
import { LuClipboardCheck } from "react-icons/lu";
import {
  Sidebar as UiSideBar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/_ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_ui/avatar";
import useUser from "@/hooks/queries/useUser";
import Logo from "@/assets/icons/logo.svg";
import { useLocation } from "@tanstack/react-router";

type MenuType = {
  title: string;
  icon: IconType;
  to: string;
};

const menus: MenuType[] = [
  {
    title: "Home",
    icon: FiHome,
    to: "/dashboard",
  },
];

const productMenus: MenuType[] = [
  {
    title: "Categorias",
    icon: TbCategoryPlus,
    to: "/dashboard/categories",
  },
  {
    title: "Produtos",
    icon: MdOutlineFastfood,
    to: "/dashboard/food",
  },
  {
    title: "Pedidos",
    icon: LuClipboardCheck,
    to: "/dashboard/orders",
  },
];

const configMenus: MenuType[] = [
  {
    title: "Empresa",
    icon: MdStorefront,
    to: "/dashboard/company",
  },
  {
    title: "Perfil",
    icon: GoPerson,
    to: "/dashboard/profile",
  },
  {
    title: "Configurações",
    icon: GoGear,
    to: "/dashboard/config",
  },
];

const advertisingMenus: MenuType[] = [
  {
    title: "Banners",
    icon: MdWallpaper,
    to: "/dashboard/banners",
  },
];

export default function Sidebar() {
  const { company } = useUser();

  return (
    <UiSideBar collapsible="icon" className="rounded-r-2xl overflow-hidden">
      <SidebarHeader className="py-6">
        <div className="flex items-center w-full gap-4">
          <img
            src={Logo || "/placeholder.svg"}
            alt="My Menu Logo"
            width={60}
            height={60}
            className="transition-all duration-200 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8"
          />
          <div>
            <h1 className="text-md">My Menu</h1>
            <p className="text-gray-400 text-sm">Cardápio Digital</p>
          </div>
        </div>
      </SidebarHeader>
      <hr />
      <SidebarContent className="mt-4">
        <SidebarMenuItemList list={menus} title="Home" />
        <SidebarMenuItemList title="Produto" list={productMenus} />
        <SidebarMenuItemList title="Publicidade" list={advertisingMenus} />
        <SidebarMenuItemList title="Configurações" list={configMenus} />
      </SidebarContent>
      <hr />
      <SidebarFooter className="py-8">
        <div className="flex w-full items-center gap-3 text-card-foreground shadow-sm">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={company?.image.url || "/placeholder.svg"}
              alt={company?.name}
            />
            <AvatarFallback>{company?.name?.charAt(0) || "C"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium leading-none">{company?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {company?.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </UiSideBar>
  );
}

function SidebarMenuItemList({
  list,
  title,
}: {
  list: MenuType[];
  title: string;
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2">{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {list.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`${
                    isActive
                      ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                      : "text-gray-500"
                  }`}
                >
                  <a
                    href={item.to}
                    className="flex items-center justify-between"
                  >
                    <div className={`flex items-center gap-2`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
