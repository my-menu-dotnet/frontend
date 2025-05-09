"use client";

import { Sidebar as ProSideBar, Menu } from "react-pro-sidebar";
import "./styles.css";
import Singout from "./Singout";
import Item from "./Item";
import SubItem from "./SubItem";
import menus from "@/utils/menus";
import Image from "next/image";
import Logo from "@/assets/logo.svg";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(false);
    }
  }, []);

  return (
    <ProSideBar
      collapsed={collapsed}
      className="h-full rounded-r-2xl shadow-lg !fixed bg-white z-50"
    >
      <div className="flex items-center justify-center h-16 mb-8 mt-6">
        <Image src={Logo} alt="Logo" width={50} height={50} priority />
      </div>
      <Menu>
        {menus.map((item, index) => {
          if (!item.enabled) {
            return null;
          }

          if (item.children) {
            return (
              <SubItem
                key={index}
                title={item.title}
                icon={item.icon}
                url={item.url!}
              >
                {item.children.map((child, index) => (
                  <Item
                    key={index}
                    title={child.title}
                    to={child.to!}
                    icon={child.icon}
                  />
                ))}
              </SubItem>
            );
          }

          return (
            <Item
              key={index}
              title={item.title}
              to={item.to!}
              icon={item.icon}
            />
          );
        })}
        <Singout />
      </Menu>
    </ProSideBar>
  );
}
