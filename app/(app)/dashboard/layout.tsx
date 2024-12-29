import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <div className="min-h-full flex flex-row flex-nowrap bg-white">
      <div className="w-[80px] md:w-[250px]">
        <Sidebar />
      </div>
      <div className="px-2 py-6 md:p-6 w-[calc(100%-80px)] md:w-[calc(100%-250px)]">
        <Header />
        {children}
      </div>
    </div>
  );
}
