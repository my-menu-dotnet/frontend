import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { CartProvider } from "@/hooks/useCart";
import { MenuCompanyProvider } from "@/hooks/useMenuCompany";
import { getMenu } from "../server/menu";

export const Route = createFileRoute("/menu/$id")({
  component: MenuLayoutRoute,
  loader: async ({ params }) => {
    const menu = await getMenu({ data: params.id });
    if (!menu) {
      throw redirect({ to: "/" });
    }
    return menu;
  },
  head: ({ loaderData }) => {
    const menu = loaderData;
    if (!menu) return {};
    return {
      meta: [
        { title: menu.company.name },
        { name: "description", content: menu.company.description },
        { name: "keywords", content: menu.categories.map((c) => c.name).join(", ") },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: menu.company.name },
        { property: "og:description", content: menu.company.description },
        { property: "og:image", content: menu.company.image },
        { property: "og:type", content: "website" },
      ],
      links: menu.company.image
        ? [{ rel: "icon", href: menu.company.image }]
        : [],
    };
  },
});

function MenuLayoutRoute() {
  const menu = Route.useLoaderData();

  useEffect(() => {
    if (typeof document !== "undefined" && menu?.company) {
      document.title = menu.company.name;
    }
  }, [menu?.company]);

  return (
    <CartProvider>
      <MenuCompanyProvider company={menu.company}>
        <Outlet />
        <Footer />
      </MenuCompanyProvider>
    </CartProvider>
  );
}
