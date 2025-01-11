import Image from "next/image";
import Background from "@/assets/home.jpg";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-full flex flex-row">
      <div className="hidden lg:block relative w-full"></div>
      <aside className="bg-white lg:rounded-2xl lg:max-w-[600px] w-full flex justify-end border-2 shadow p-4">
        {children}
      </aside>
      <Image
        alt="Home"
        height={0}
        width={0}
        className="-z-10 absolute h-full w-auto object-cover"
        src={Background}
        priority
      />
    </div>
  );
}
