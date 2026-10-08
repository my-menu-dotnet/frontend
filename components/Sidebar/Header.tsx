"use client";

import menus, { PageMenus } from "@/utils/menus";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { MdChevronLeft } from "react-icons/md";
import { IoMenu } from "react-icons/io5";

type HeaderProps = {
  onClickMenu: () => void;
};

export default function Header({ onClickMenu }: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const current = useMemo(() => {
    const list = menus.reduce((acc, item) => {
      if (item.children) {
        item.children.forEach((child) => {
          acc[child.to!] = child;
        });
      }

      acc[item.to!] = item;

      return acc;
    }, {} as Record<string, PageMenus>);
    return list;
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <header className="relative mb-4 bg-white p-6 flex justify-between items-center h-24">
        <div>
          {current[pathname as keyof typeof current] ? (
            <>
              <h1 className="text-lg">
                {current[pathname as keyof typeof current].title}
              </h1>
              <h2 className="text-gray-400 text-sm">
                {current[pathname as keyof typeof current].description}
              </h2>
            </>
          ) : (
            <div onClick={handleBack} className="cursor-pointer">
              <MdChevronLeft className="text-gray-400" size={25} />
            </div>
          )}
        </div>
        <IoMenu size={25} className="text-gray-400" onClick={onClickMenu} />
      </header>
    </>
  );
}
