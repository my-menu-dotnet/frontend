import { NotificationOrderProvider } from "@/hooks/useNotificationOrder";
import { PrintProvider } from "@/hooks/usePrint";
import DashboardLayout from "@/layout/DashboardLayout";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <DashboardLayout>
      <NotificationOrderProvider>
        <PrintProvider>{children}</PrintProvider>
      </NotificationOrderProvider>
    </DashboardLayout>
  );
}
