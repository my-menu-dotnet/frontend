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
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import useUser from "./queries/useUser";
import Cookies from "js-cookie";
import { CredentialResponse } from "@react-oauth/google";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "@/types/api/User";

type AuthContextProps = {
  loginGoogle: UseMutationResult<
    AxiosResponse<User, unknown>,
    AxiosError<unknown, unknown>,
    CredentialResponse,
    unknown
  >;
  logout: UseMutationResult<AxiosResponse<unknown>, AxiosError<unknown>, void>;
};

const AuthContext = createContext<AuthContextProps>({
  loginGoogle: {} as UseMutationResult<
    AxiosResponse<User, unknown>,
    AxiosError<unknown, unknown>,
    CredentialResponse,
    unknown
  >,
  logout: {} as UseMutationResult<
    AxiosResponse<unknown>,
    AxiosError<unknown>,
    void
  >,
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
  const { data: user, refetch: refetchUser } = useUser();
  const router = useRouter();
  const pathName = usePathname();
  const queryClient = useQueryClient();

  const loginGoogle = useMutation<
    AxiosResponse<User>,
    AxiosError,
    CredentialResponse
  >({
    mutationFn: (credential: CredentialResponse) =>
      api.post("/v1/oauth/google", credential),
    onSuccess: () => refetchUser(),
  });

  const logout = useMutation<AxiosResponse<unknown>, AxiosError<unknown>, void>(
    {
      mutationFn: () => api.post("/v1/oauth/logout"),
      onSuccess: () => {
        Cookies.remove("is_authenticated");
        queryClient.clear();
      },
    }
  );

  const handleRedirect = useCallback(async () => {
    if (!user && pathName.startsWith("/dashboard")) {
      router.replace("/auth");
      return;
    }

    if (user && !user.company && pathName.startsWith("/dashboard")) {
      router.replace("/auth/company");
      return;
    }

    if (user?.company && pathName.startsWith("/auth")) {
      router.replace("/dashboard");
      return;
    }
  }, [pathName, router, user]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <AuthContext.Provider value={{ loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
