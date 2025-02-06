import type { Metadata } from "next";
import "@/globals.css";
import { ReactQueryProvider } from "@/hooks/query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import { Roboto } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "Crie seu Cardápio Digital Grátis e Personalizado!",
  description:
    "Transforme seu cardápio com o My Menu! Digital, interativo e acessível via QR Code. Personalize fácil e experimente grátis!",
  category: "Cardápio Digital, Restaurantes, Delivery",
  creator: "My Menu Team",
  keywords: [
    "cardápio digital",
    "menu digital",
    "QR Code cardápio",
    "cardápio online",
    "restaurante",
    "bares",
    "cafeteria",
    "delivery",
    "pedidos online",
    "menu interativo",
    "comanda digital",
    "gestão de cardápio",
    "marketing para restaurantes",
    "foodtech",
    "plataforma para restaurantes",
  ],
  assets: ["https://my-menu.net/assets"],
  authors: [
    {
      name: "Thiago Crepequer",
      url: "https://www.linkedin.com/in/thiago-crepequer/",
    },
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "My Menu - Cardápio Digital",
    title: "My Menu - Crie seu Cardápio Digital Personalizado!",
    description: `
      Modernize seu restaurante com um cardápio digital acessível via QR Code. Fácil de criar, 
      editar e compartilhar. Aumente suas vendas e ofereça uma experiência única aos seus clientes!
    `,
    images: [
      {
        url: "https://my-menu.net/assets/images/cardapio-digital-preview.png",
        width: 1200,
        height: 630,
        alt: "Visual do My Menu - Cardápio Digital",
      },
    ],
    url: "https://my-menu.net",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mymenu",
    title: "My Menu - Seu Cardápio Digital Interativo!",
    description: `
      Crie um cardápio digital profissional e moderno para o seu restaurante. Simples, rápido e gratuito!
    `,
    images: [
      {
        url: "https://my-menu.net/assets/images/cardapio-digital-preview.png",
        alt: "Visual do My Menu - Cardápio Digital",
      },
    ],
  },
  applicationName: "My Menu - Cardápio Digital",
  abstract: `
    Modernize seu restaurante com um cardápio digital acessível via QR Code. Fácil de criar, 
    editar e compartilhar. Aumente suas vendas e ofereça uma experiência única aos seus clientes!
  `,
  robots: {
    follow: true,
    index: true,
  },
  manifest: "https://my-menu.net/manifest.json",
  publisher: "My Menu",
  alternates: {
    canonical: "https://my-menu.net",
  },
};

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`light w-full h-full ${roboto.className}`}>
      <body className={`antialiased w-full min-h-screen bg-slate-50`}>
        <ReactQueryProvider>
          <AuthProvider>
            <NextUIProvider>
              {children}
              <ToastContainer />
            </NextUIProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
