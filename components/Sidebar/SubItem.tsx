import { useLocation } from "@tanstack/react-router";
import { SubMenu } from "react-pro-sidebar";

type SubItemProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  url: string;
};

const SubItem = ({ title, icon, url, children }: SubItemProps) => {
  const { pathname } = useLocation();

  return (
    <SubMenu
      label={title}
      icon={icon}
      className="text-gray-400"
      defaultOpen={pathname.startsWith("/dashboard" + url)}
    >
      {children}
    </SubMenu>
  );
};

export default SubItem;
