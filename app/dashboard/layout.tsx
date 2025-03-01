import DashboardLayout from "@/layout/DashboardLayout";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
