import { FiHome } from "react-icons/fi";
import { MdOutlineFastfood, MdStorefront } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { GoPerson } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { TbCategoryPlus } from "react-icons/tb";
import { LuBadgePercent } from "react-icons/lu";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { MdWallpaper } from "react-icons/md";
import { LuClipboardCheck } from "react-icons/lu";

export type PageMenus = {
  title: string;
  description?: string;
  icon: React.ReactNode;
  to?: string;
  url?: string;
  children?: PageMenus[];
  enabled: boolean;
};

const menus: PageMenus[] = [
  {
    title: "Home",
    description: "Bem-vindo de volta! Veja as novidades da sua empresa!",
    icon: <FiHome />,
    to: "/dashboard",
    enabled: true,
  },
  {
    title: "Empresa",
    description: "Mantenha as informações da sua empresa sempre atualizadas!",
    icon: <MdStorefront />,
    to: "/dashboard/company",
    enabled: true,
  },
  {
    title: "Categorias",
    description: "Adicione, edite ou remova categorias de produtos!",
    icon: <TbCategoryPlus />,
    to: "/dashboard/menu/categories",
    enabled: true,
  },
  {
    title: "Produtos",
    description: "Adicione, edite ou remova produtos do seu cardápio!",
    icon: <MdOutlineFastfood />,
    to: "/dashboard/food",
    enabled: true,
  },
  {
    title: "Pedidos",
    description: "Veja os pedidos feitos pelos seus clientes!",
    icon: <LuClipboardCheck />,
    to: "/dashboard/orders",
    enabled: true,
  },
  {
    title: "Banners",
    description: "Adicione, edite ou remova banners do seu cardápio!",
    icon: <MdWallpaper />,
    to: "/dashboard/banners",
    enabled: true,
  },
  {
    title: "Perfil",
    icon: <GoPerson />,
    to: "/dashboard/profile",
    enabled: false,
  },
  {
    title: "Configurações",
    icon: <GoGear />,
    to: "/dashboard/config",
    enabled: false,
  },
];

export default menus;
