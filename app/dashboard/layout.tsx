import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/hooks/useAuth";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <AuthProvider>
      <div className="min-h-full flex flex-row bg-gray-100">
        <Sidebar />
        <div className="p-2 md:p-6 flex-1 flex-wrap w-full md:w-auto">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
