"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "./queries/useUser";

type AuthContextProps = {
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  login: () => null,
  logout: () => null,
});

export function useAuth() {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user } = useUser();
  const router = useRouter();
  const pathName = usePathname();
  const queryClient = useQueryClient();

  const login = () => {
    localStorage.setItem("authenticated", "true");
    router.push("/dashboard");
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      queryClient.clear();
      localStorage.removeItem("authenticated");
      router.replace("/auth/login");
    } catch (logoutError) {
      console.error(logoutError);
    }
  }, []);

  const handleRedirect = useCallback(() => {
    const authenticated = localStorage.getItem("authenticated");

    if (!authenticated && pathName.startsWith("/dashboard")) {
      router.replace("/auth/login");
      return;
    }

    if (authenticated && pathName.startsWith("/auth")) {
      router.replace("/dashboard");
      return;
    }

    if (authenticated && user && pathName.startsWith("/dashboard")) {
      const redirectChecks = [
        {
          condition: !user.verified_email,
          route: "/auth/verify-email",
        },
        {
          condition: !user.company,
          route: "/auth/company",
        },
        {
          condition: user.company && !user.company.verified_email,
          route: "/auth/company/verify-email",
        },
      ];

      for (const check of redirectChecks) {
        if (check.condition) {
          router.replace(check.route);
          return;
        }
      }
    }
  }, [pathName, router, user]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
