import { FiHome } from "react-icons/fi";
import { MdOutlineFastfood, MdStorefront } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { GoPerson } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { TbCategoryPlus } from "react-icons/tb";
import { LuBadgePercent } from "react-icons/lu";

type Menu = {
  title: string;
  icon: React.ReactNode;
  to?: string;
  url?: string;
  children?: Menu[];
};

const menus: Menu[] = [
  {
    title: "Dashboard",
    icon: <FiHome />,
    to: "/dashboard",
  },
  {
    title: "Empresa",
    icon: <MdStorefront />,
    to: "/dashboard/company",
  },
  {
    title: "Cardapio",
    icon: <BiFoodMenu />,
    url: "/menu",
    children: [
      {
        title: "Categorias",
        icon: <TbCategoryPlus />,
        to: "/dashboard/menu/categories",
      },
      {
        title: "Produtos",
        icon: <MdOutlineFastfood />,
        to: "/dashboard/menu/products",
      },
      {
        title: "Promoções",
        icon: <LuBadgePercent />,
        to: "/dashboard/menu/discounts",
      },
    ],
  },
  {
    title: "Perfil",
    icon: <GoPerson />,
    to: "/dashboard/profile",
  },
  {
    title: "Configurações",
    icon: <GoGear />,
    to: "/dashboard/config",
  },
];

export default menus;
