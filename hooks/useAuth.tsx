"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import api, { setupApi } from "@/services/api";
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
  const { data: user, isLoading, refetch } = useUser();
  const router = useRouter();
  const pathName = usePathname();
  const queryClient = useQueryClient();

  const login = () => {
    refetch();
    router.push("/dashboard");
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      queryClient.clear();
      router.replace("/auth/login");
    } catch (logoutError) {
      console.error(logoutError);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!user && !pathName.startsWith("/auth")) {
      router.replace("/auth/login");
      return;
    }
    if (user && !user.verified_email) {
      router.replace("/auth/verify-email");
      return;
    }
    if (user && user.companies.length === 0) {
      router.replace("/auth/company");
      return;
    }
    if (user && pathName.startsWith("/auth")) {
      router.replace("/dashboard");
      return;
    }
  }, [pathName, user]);

  setupApi(logout);

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
