import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ReactQueryProvider } from "@/hooks/query";
import { ReactNode } from "react";

export default function LayoutProviders({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          {children}
        </TooltipProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
