"use client";

import { Sidebar as ProSideBar, Menu } from "react-pro-sidebar";
import "./styles.css";
import { useEffect, useState } from "react";
import Header from "./Header";
import Singout from "./Singout";
import Item from "./Item";
import SubItem from "./SubItem";
import menus from "@/utils/menus";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setCollapsed(window.innerWidth < 768);
  }, []);

  return (
    <ProSideBar collapsed={collapsed} backgroundColor="white">
      <Header />
      <Menu>
        {menus.map((item, index) => {
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
