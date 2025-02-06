import Image from "next/image";
import Background from "@/assets/home.jpg";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full h-screen flex flex-row">
      <Image
        alt="Home"
        height={0}
        width={0}
        className="absolute h-full w-auto object-cover"
        src={Background}
        priority
      />
      <div className="hidden lg:block relative w-full"></div>
      <aside className="z-10 bg-white lg:rounded-2xl lg:max-w-[600px] w-full flex justify-end border-2 shadow p-4">
        {children}
      </aside>
    </div>
  );
}
