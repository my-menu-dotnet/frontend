import { FiHome } from "react-icons/fi";
import { MdOutlineFastfood, MdStorefront } from "react-icons/md";
import { BiFoodMenu } from "react-icons/bi";
import { GoPerson } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { TbCategoryPlus } from "react-icons/tb";
import { LuBadgePercent } from "react-icons/lu";

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
    title: "Altere dados da sua empresa",
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
    to: "/dashboard/menu/products",
    enabled: true,
  },
  {
    title: "Promoções",
    description: "Adicione, edite ou remova promoções do seu cardápio!",
    icon: <LuBadgePercent />,
    to: "/dashboard/menu/discounts",
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
