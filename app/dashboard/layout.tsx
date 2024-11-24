import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/hooks/useAuth";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <AuthProvider>
      <div className="h-full flex flex-row">
        <Sidebar />
        {children}
      </div>
    </AuthProvider>
  );
}
