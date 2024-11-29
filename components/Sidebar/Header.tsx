import Image from "next/image";
import { memo } from "react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Logo from "@/assets/logo.svg";
import Font from "next/font/local";

const MoreSugar = Font({
  src: "./MoreSugar-Regular.ttf",
});

type HeaderProps = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const Header = ({ collapsed, toggleCollapsed }: HeaderProps) => {
  return (
    <div className="relative">
      <div className="mt-4 w-full flex flex-col justify-center items-center gap-2">
        <Image src={Logo} alt="Logo" width={50} height={50} priority />
        <h1
          className={`${MoreSugar.className} text-primary`}
          style={{ display: collapsed ? "none" : "" }}
        >
          My Menu
        </h1>
      </div>

      <div
        onClick={toggleCollapsed}
        className="absolute top-0 right-2 active:opacity-50 cursor-pointer"
      >
        {collapsed ? (
          <HiChevronDoubleRight size={24} className="fill-gray-400" />
        ) : (
          <HiChevronDoubleLeft size={24} className="fill-gray-400" />
        )}
      </div>

      <div className="w-full flex justify-center mt-6 mb-4">
        <hr className="w-11/12 border-gray-200" />
      </div>
    </div>
  );
};

export default memo(Header);
