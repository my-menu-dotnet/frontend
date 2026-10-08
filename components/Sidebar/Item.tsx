"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { MenuItem } from "react-pro-sidebar";

type ItemProps = {
  title: string;
  to: string;
  icon?: React.ReactNode;
};

const Item = ({ title, to, icon }: ItemProps) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <MenuItem
      active={active}
      className="text-gray-400"
      icon={icon}
      component={<Link to={to}>{title}</Link>}
    >
      {title}
    </MenuItem>
  );
};

export default Item;
