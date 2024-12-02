"use client";

import { Sidebar as ProSideBar, Menu, MenuItem } from "react-pro-sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./styles.css";
import { FiHome } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { GoPerson } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "./Header";

export default function Sidebar() {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  return (
    <ProSideBar collapsed={collapsed} backgroundColor="white">
      <Header collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <Menu>
        <Item icon={<FiHome />} title="Dashboard" to="/dashboard" />
        <Item icon={<MdStorefront />} title="Empresa" to="/dashboard/company" />
        <Item icon={<BiFoodMenu />} title="Cardápio" to="/dashboard/menu" />
        <Item icon={<GoPerson />} title="Perfil" to="/dashboard/profile" />
        <Item icon={<GoGear />} title="Configurações" to="/dashboard/config" />
        {/* <MenuItem
          className="text-danger"
          icon={<FiLogOut />}
          component={<div onClick={logout} />}
        >
          Sair
        </MenuItem> */}
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
      className="text-gray-500"
      icon={icon}
      component={<Link href={to} />}
    >
      {title}
    </MenuItem>
  );
};
