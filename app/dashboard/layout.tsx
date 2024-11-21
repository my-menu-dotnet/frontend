import Sidebar from "@/components/SideBar";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <div className="h-full flex flex-row">
      <Sidebar />
      {children}
    </div>
  );
}
