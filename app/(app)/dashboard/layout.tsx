import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <div className="min-h-full flex flex-row flex-nowrap bg-[#F1F1F1]">
      <Sidebar />
      <div className="w-full">
        <Header />
        <section className="px-1 md:px-4 ml-[80px]">{children}</section>
      </div>
    </div>
  );
}
