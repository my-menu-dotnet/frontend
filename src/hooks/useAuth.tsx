"use client";

import {
  createContext,
  ReactNode,
  useContext,
} from "react";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CredentialResponse } from "@react-oauth/google";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "@/@types/api/User";
import api from "@/service/api";
import useUser from "./queries/useUser";

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
  const { refetch: refetchUser } = useUser();
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

  return (
    <AuthContext.Provider value={{ loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
