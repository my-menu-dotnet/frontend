import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/hooks/useAuth";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <div className="min-h-full flex flex-row bg-white">
      <Sidebar />
      <div className="px-2 md:p-6 flex-1 flex-wrap w-full md:w-auto">
        <Header />
        {children}
      </div>
    </div>
  );
}
