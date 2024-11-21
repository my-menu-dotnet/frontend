"use client";

import Image from "next/image";
import {
  Sidebar as ProSideBar,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import Logo from "@/assets/logo.svg";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [selected, setSelected] = useState("Dashboard");

  return (
    <ProSideBar>
      <div>
        <Image src={Logo} className="mb-8" alt="Logo" width={60} height={60} />
      </div>
      <Menu>
        <Item
          title="Dashboard"
          to="/dashboard"
          selected={selected}
          setSelected={setSelected}
        />
      </Menu>
    </ProSideBar>
  );
}

type ItemProps = {
  title: string;
  to: string;
  icon?: React.ReactNode;
  selected: string;
  setSelected: (value: string) => void;
};

const Item = ({ title, to, icon, selected, setSelected }: ItemProps) => {
  return (
    <MenuItem
      active={selected === title}
      className="text-gray-100"
      onClick={() => setSelected(title)}
      icon={icon}
    >
      {title}
      <Link href={to} />
    </MenuItem>
  );
};
