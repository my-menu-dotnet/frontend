import type { Metadata } from "next";
import "@/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "My Menu",
  description: `
    My Menu is a simple application that allows you to create your own menu
    with your favorite dishes and drinks. You can also share your menu with
    your customers and friends. Enjoy it!
  `,
  category: "Food & Drink",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider>{children}</AuthProvider>;
}
