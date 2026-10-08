import type { ReactNode } from "react";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import LayoutProviders from "@/layout/LayoutProviders";
import "@/globals.css";
import "react-toastify/dist/ReactToastify.css";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    errorComponent: RootErrorComponent,
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Transforme seu cardápio com o My Menu! Digital, interativo e acessível via QR Code. Personalize fácil e experimente grátis!",
        },
        { name: "category", content: "Cardápio Digital, Restaurantes, Delivery" },
        { name: "creator", content: "My Menu Team" },
        { name: "application-name", content: "My Menu - Cardápio Digital" },
        { name: "publisher", content: "My Menu" },
        { name: "robots", content: "follow, index" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:site_name", content: "My Menu - Cardápio Digital" },
        { property: "og:title", content: "My Menu - Crie seu Cardápio Digital Personalizado!" },
        {
          property: "og:description",
          content:
            "Modernize seu restaurante com um cardápio digital acessível via QR Code. Fácil de criar, editar e compartilhar. Aumente suas vendas e ofereça uma experiência única aos seus clientes!",
        },
        {
          property: "og:image",
          content: "https://my-menu.net/assets/images/cardapio-digital-preview.png",
        },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content: "Visual do My Menu - Cardápio Digital",
        },
        { property: "og:url", content: "https://my-menu.net" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@mymenu" },
        {
          name: "twitter:title",
          content: "My Menu - Seu Cardápio Digital Interativo!",
        },
        {
          name: "twitter:description",
          content:
            "Crie um cardápio digital profissional e moderno para o seu restaurante. Simples, rápido e gratuito!",
        },
        {
          name: "twitter:image",
          content: "https://my-menu.net/assets/images/cardapio-digital-preview.png",
        },
        {
          name: "twitter:image:alt",
          content: "Visual do My Menu - Cardápio Digital",
        },
        { name: "theme-color", content: "#ffffff" },
        {
          name: "keywords",
          content:
            "cardápio digital, menu digital, QR Code cardápio, cardápio online, restaurante, bares, cafeteria, delivery, pedidos online, menu interativo, comanda digital, gestão de cardápio, marketing para restaurantes, foodtech, plataforma para restaurantes",
        },
      ],
      links: [
        { rel: "canonical", href: "https://my-menu.net" },
        { rel: "manifest", href: "https://my-menu.net/manifest.json" },
        { rel: "icon", href: "/favicon.ico" },
        // Roboto (weight 400) is loaded here for the legacy `font-roboto` class
        // still used in some places. Montserrat (weights 400-900) is bundled
        // via @fontsource/montserrat CSS imports in globals.css — no Google
        // Fonts call needed.
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap",
        },
      ],
      scripts: [
        // Google Analytics (G-LERMXSW7JQ) — replaces @next/third-parties/google
        {
          src: "https://www.googletagmanager.com/gtag/js?id=G-LERMXSW7JQ",
          async: true,
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LERMXSW7JQ');
          `,
        },
      ],
    }),
    component: RootComponent,
  });

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootErrorComponent({ error }: { error: unknown }) {
  const message =
    error instanceof Error ? error.message : "Erro inesperado ao renderizar.";
  return (
    <RootDocument>
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Algo deu errado
        </h1>
        <p className="text-sm text-slate-600 max-w-md">{message}</p>
        <a
          href="/"
          className="mt-2 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Voltar para a página inicial
        </a>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-br" className="light w-full h-full">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased w-full min-h-screen bg-slate-50 font-sans">
        <LayoutProviders>
          {children}
          <ToastContainer />
        </LayoutProviders>
        <Scripts />
      </body>
    </html>
  );
}
