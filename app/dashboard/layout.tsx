import Header from "@/components/Sidebar/Header";
import Sidebar from "@/components/Sidebar";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return <Sidebar>{children}</Sidebar>;
}
