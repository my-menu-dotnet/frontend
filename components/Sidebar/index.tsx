"use client";

import { Sidebar as ProSideBar, Menu } from "react-pro-sidebar";
import "./styles.css";
import Singout from "./Singout";
import Item from "./Item";
import SubItem from "./SubItem";
import menus from "@/utils/menus";
import Image from "next/image";
import Logo from "@/assets/logo.svg";
import { Drawer, DrawerContent } from "@nextui-org/react";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-row flex-nowrap bg-[#F1F1F1]">
      {isMobile ? (
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="left"
        >
          <DrawerContent className="w-[80px]">
            <Bar />
          </DrawerContent>
        </Drawer>
      ) : (
        <Bar />
      )}
      <div className="w-full min-h-full md:ml-[80px]">
        <Header onClickMenu={() => setIsOpen(true)} />
        <section className="px-1 md:px-4">{children}</section>
      </div>
    </div>
  );
}

const Bar = () => {
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
};
