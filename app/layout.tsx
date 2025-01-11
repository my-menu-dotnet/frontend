import type { Metadata } from "next";
import "@/globals.css";
import { ReactQueryProvider } from "@/hooks/query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "My Menu",
  description: `
    My Menu is a simple application that allows you to create your own menu
    with your favorite dishes and drinks. You can also share your menu with
    your customers and friends. Enjoy it!
  `,
  category: "Food & Drink",
  creator: "My Menu Team",
  bookmarks: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
};

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`light w-full h-full bg-white ${roboto.className}`}>
      <body className={`antialiased w-full h-full`}>
        <ReactQueryProvider>
          <NextUIProvider className="w-full h-full">
            {children}
            <ToastContainer />
          </NextUIProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
