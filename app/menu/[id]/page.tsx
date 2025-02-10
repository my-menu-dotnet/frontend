import api from "@/services/api";
import { Menu } from "@/types/api/Menu";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import FoodCard from "@/components/FoodCard";
import { Food } from "@/types/api/Food";
import { Category } from "@/types/api/Category";
import Analytics from "@/components/Menu/Analytics";
import { Montserrat } from "next/font/google";
import { Chip } from "@nextui-org/react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import Phone from "@/components/Menu/components/Phone";
import FoodDefault from "@/assets/default-food.jpg";
import { CiLocationOn } from "react-icons/ci";
import Header from "@/components/Menu/Header";
import Banners from "@/components/Menu/Banners";
import FoodList from "@/components/Menu/FoodList";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const menu = await getMenu(id);

  return {
    title: `${menu.company.name}`,
    icons: {
      icon: menu.company.image.url,
    },
    description: menu.company.description,
    authors: [
      { name: menu.company.name },
      { name: "MyMenu", url: "https://my-menu.net" },
    ],
    keywords: menu.categories.map((category) => category.name),
    category: "menu",
    creator: menu.company.name,
    applicationName: menu.company.name,
    abstract: menu.company.description,
    robots: {
      follow: true,
      index: true,
    },
  };
}

export default async function Page({ params }: Props) {
  try {
    const { id } = await params;
    const menu = await getMenu(id);

    const color = menu.company.primary_color || "#000";

    return (
      menu && (
        <>
          <div className="min-h-screen">
            <Header menu={menu} color={color} />
            <main className="flex flex-col w-full items-center px-4">
              <div className="max-w-[1200px] w-full">
                <Banners menu={menu} />
                <FoodList menu={menu} color={color} />
              </div>
            </main>
          </div>

          <Footer />

          <Analytics menu={menu} />
        </>
      )
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

let staticMenu = {} as Menu;

const getMenu = async (id: string) => {
  if (staticMenu.company && staticMenu.company.id === id) {
    return staticMenu;
  }

  const { data } = await api(`/menu/${id}`);
  staticMenu = data;
  return data as Menu;
};

{
  /*  */
}
