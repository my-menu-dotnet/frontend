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
