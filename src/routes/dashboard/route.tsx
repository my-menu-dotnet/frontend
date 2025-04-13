import DashboardLayout from "@/layout/DashboardLayout";
import { isAuthenticated } from "@/utils/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
