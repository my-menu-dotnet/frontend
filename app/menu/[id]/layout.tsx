import Footer from "@/components/Footer";
import BottomBar from "@/components/Menu/BottomBar";
import { CartProvider } from "@/hooks/useCart";
import api from "@/services/api";
import { Menu } from "@/types/api/Menu";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const menu = await getMenu(id);

  if (!menu) {
    return notFound();
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

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CartProvider>{children}</CartProvider>

      <Footer />
    </>
  );
}

const getMenu = async (id: string) => {
  try {
    // const cookieStore = cookies();
    // const accessToken = (await cookieStore).get("accessToken");

    const { data } = await api(`/menu`, { headers: { "X-Company-ID": id } });
    return data as Menu;
  } catch (e) {
    console.error(e);
  }
};
