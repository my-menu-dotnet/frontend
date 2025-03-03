"use client";

import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/hooks/useAuth";
import { ReactQueryProvider } from "@/hooks/query";
import { ReactNode } from "react";

export default function LayoutProviders({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
