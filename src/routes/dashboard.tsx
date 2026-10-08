import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NotificationOrderProvider } from "@/hooks/useNotificationOrder";
import { PrintProvider } from "@/hooks/usePrint";
import DashboardLayout from "@/layout/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  return (
    <DashboardLayout>
      <NotificationOrderProvider>
        <PrintProvider>
          <Outlet />
        </PrintProvider>
      </NotificationOrderProvider>
    </DashboardLayout>
  );
}
