"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setupApi } from "@/services/api";
import { useUser } from "./useUser";

type AuthContextProps = {
  login: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  login: () => null,
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
  const { user, refetch } = useUser();
  const router = useRouter();

  const login = () => {
    router.push("/dashboard");
    refetch();
  };

  const logout = () => {
    api.post("/auth/logout").then(() => {
      router.push("/auth/login");
    });
  };

  useEffect(() => {
    setupApi(logout);

    if (user) {
      router.push("/dashboard");
      return;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>
  );
}
