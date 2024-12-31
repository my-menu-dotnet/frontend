"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "react-pro-sidebar";

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

export default Item;