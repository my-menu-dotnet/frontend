import api from "@/services/api";
import { Menu } from "@/types/api/Menu";
import { Metadata } from "next";
import Image from "next/image";
import { MdOutlineAlternateEmail } from "react-icons/md";
import Phone from "@/components/Menu/Phone";
import { CiLocationArrow1 } from "react-icons/ci";
import { redirect } from "next/navigation";
import FoodCard from "@/components/FoodCard";
import { Food } from "@/types/api/Food";
import { Category } from "@/types/api/Category";

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
          <header className="w-full flex justify-center px-4">
            <section className="flex flex-row items-center justify-between max-w-[1200px] w-full py-2">
              <Image
                src={menu.company.image.url}
                alt={menu.company.name}
                width={120}
                height={120}
                quality={100}
                priority
              />
              <address className="flex flex-row items-center gap-4 not-italic text-gray-400">
                {menu.company.email && (
                  <a href={`mailto:${menu.company.email}`}>
                    <MdOutlineAlternateEmail size={22} />
                  </a>
                )}
                {menu.company.phone && <Phone phone={menu.company.phone} />}
                {menu.company.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${menu.company.address.latitude},${menu.company.address.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row gap-2 rounded-md px-2 py-1 text-white"
                    style={{ backgroundColor: color }}
                  >
                    <CiLocationArrow1 size={22} />
                    {menu.company.address.state} - {menu.company.address.city}
                  </a>
                )}
              </address>
            </section>
          </header>
          <main className="flex flex-col w-full items-center px-4">
            <div className="max-w-[1200px] w-full">
              <div
                className="w-full h-80 rounded-md"
                style={{ backgroundColor: color }}
              ></div>
              <div className="w-full">
                {menu.categories.map(
                  (category: Category) =>
                    category.foods.length > 0 && (
                      <section
                        key={category.id}
                        className="flex flex-col gap-4 mt-4"
                      >
                        <h2 className="font-bold">{category.name}</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {category.foods.map((product: Food) => (
                            <FoodCard
                              key={product.id}
                              food={product}
                              discountColor={color}
                            />
                          ))}
                        </ul>
                      </section>
                    )
                )}
              </div>
            </div>
          </main>
          <hr className="w-full mt-6" />
          <footer className="flex flex-col justify-center items-center w-full h-16">
            <p className="text-center">
              Desenvolvidor por{" "}
              <a
                className="underline"
                href="https://my-menu.net"
                target="_blank"
                rel="noreferrer"
              >
                @MyMenu
              </a>{" "}
              &#9829;
            </p>
          </footer>
        </>
      )
    );
  } catch (error) {
    console.log(error);
    return redirect("/404");
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
