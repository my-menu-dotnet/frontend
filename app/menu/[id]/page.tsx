import api from "@/services/api";
import { Menu } from "@/types/api/Menu";
import { notFound } from "next/navigation";
import Header from "@/components/Menu/Header";
import Banners from "@/components/Menu/Banners";
import FoodList from "@/components/Menu/FoodList";
import BottomBar from "@/components/Menu/BottomBar";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
          <BottomBar />
        </>
      )
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

const getMenu = async (id: string) => {
  try {
    // const cookieStore = cookies();
    // const accessToken = (await cookieStore).get("accessToken");
    const { data } = await api(`/menu`, { headers: { _company: id } });
    return data as Menu;
  } catch (e) {
    console.error(e);
  }
};
