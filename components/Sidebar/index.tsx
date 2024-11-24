"use client";

import Image from "next/image";
import { Sidebar as ProSideBar, Menu, MenuItem } from "react-pro-sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./styles.css";
import { FiHome } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { GoGear } from "react-icons/go";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

import { useState } from "react";
import useCompany from "@/hooks/queries/useCompany";
import HeaderSkeleton from "./HeaderSkeleton";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { logout } = useAuth();
  const { data: company, isFetching } = useCompany();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ProSideBar collapsed={collapsed}>
      {company && !isFetching ? (
        <div className="relative">
          <div className="mt-12 w-full flex justify-center items-center flex-col">
            <Image src={company.image.url} alt="Logo" width={50} height={50} />
            <h1
              className="text-gray-500 font-semibold mt-1 mb-2 transition-all"
              style={{ opacity: collapsed ? 0 : 1 }}
            >
              {company.name}
            </h1>
          </div>

          <div
            onClick={toggleCollapsed}
            className="absolute -top-8 right-2 active:opacity-50"
          >
            {collapsed ? (
              <HiChevronDoubleRight size={24} className="fill-gray-400" />
            ) : (
              <HiChevronDoubleLeft size={24} className="fill-gray-400" />
            )}
          </div>
        </div>
      ) : (
        <HeaderSkeleton />
      )}
      <Menu>
        <Item icon={<FiHome />} title="Dashboard" to="/dashboard" />
        <MenuDivider collapsed={collapsed}>Empresa</MenuDivider>
        <Item icon={<MdStorefront />} title="Empresa" to="/company" />
        <MenuDivider collapsed={collapsed}>Cardápio</MenuDivider>
        <Item icon={<BiFoodMenu />} title="Cardápio" to="/menu" />
        <MenuDivider collapsed={collapsed}>Outros</MenuDivider>
        <Item icon={<GoGear />} title="Configurações" to="/config" />
        <MenuItem
          className="text-danger"
          icon={<FiLogOut />}
          component={<div onClick={logout} />}
        >
          Sair
        </MenuItem>
      </Menu>
    </ProSideBar>
  );
}

type ItemProps = {
  title: string;
  to: string;
  icon?: React.ReactNode;
};

const Item = ({ title, to, icon }: ItemProps) => {
  const pathName = usePathname();
  const active = pathName === to;

  return (
    <MenuItem
      active={active}
      className="text-gray-400"
      icon={icon}
      component={<Link href={to} />}
    >
      {title}
    </MenuItem>
  );
};

type MenuDividerProps = {
  children: string;
  collapsed: boolean;
};

const MenuDivider = ({ children, collapsed }: MenuDividerProps) => {
  return (
    <p
      className="pl-5 text-gray-300 uppercase text-sm font-semibold transition-all"
      style={{
        opacity: collapsed ? 0 : 1,
      }}
    >
      {children}
    </p>
  );
};
