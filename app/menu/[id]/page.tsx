import api from "@/services/api";
import { Menu } from "@/types/api/Menu";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Menu/Header";
import Banners from "@/components/Menu/Banners";
import FoodList from "@/components/Menu/FoodList";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { BsCart3 } from "react-icons/bs";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const menu = await getMenu(id);

  if (!menu) {
    return {
      title: "Menu não encontrado",
      description: "O menu que você está tentando acessar não foi encontrado.",
      robots: {
        follow: false,
        index: false,
      },
    };
  }

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

export default async function Page({ params, searchParams }: Props) {
  try {
    const { id } = await params;
    const { access_way } = await searchParams;
    const menu = await getMenu(id);

    if (!menu) {
      return notFound();
    }

    api.post("/analytics/company/user-access", {
      company_id: menu.company.id,
      access_way: access_way || "WEB",
      accessed_at: new Date(),
    });

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

          <div
            className="fixed bottom-0 right-0 z-50 h-14 w-full bg-white shadow-2xl flex items-center justify-end px-6"
            style={{ boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center gap-4">
              <BsCart3 size={30} className="fill-gray-400"/>
            </div>
          </div>
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
  try {
    // const cookieStore = cookies();
    // const accessToken = (await cookieStore).get("accessToken");

    if (staticMenu.company && staticMenu.company.id === id) {
      return staticMenu;
    }

    const { data } = await api(`/menu/${id}`);
    staticMenu = data;
    return data as Menu;
  } catch (e) {
    console.error(e);
  }
};
