import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "My Menu | %s",
    default: "",
  }
}

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
