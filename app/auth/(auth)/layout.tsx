import Image from "next/image";
import Background from "@/assets/home.jpg";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full h-full flex flex-row">
      <div className="hidden lg:block relative w-full">
        {/* <div className="absolute top-2 bottom-2 left-2 right-2 border-3 rounded-xl border-primary" /> */}
      </div>
      <aside className="bg-white rounded-2xl lg:max-w-[600px] w-full flex justify-end border-2 shadow p-4">
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
