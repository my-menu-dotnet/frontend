import { usePathname } from "next/navigation";
import { SubMenu } from "react-pro-sidebar";

type SubItemProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  url: string;
};

const SubItem = ({ title, icon, url, children }: SubItemProps) => {
  const pathName = usePathname();

  return (
    <SubMenu
      label={title}
      icon={icon}
      className="text-gray-500"
      defaultOpen={pathName.startsWith("/dashboard" + url)}
    >
      {children}
    </SubMenu>
  );
};

export default SubItem;