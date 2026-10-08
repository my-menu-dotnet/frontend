import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import api from "@/services/api";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import useUser from "./queries/useUser";
import Cookies from "js-cookie";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "@/types/api/User";

type CredentialResponse = {
  credential: string;
  clientId?: string;
  select_by?: string;
};

export type { CredentialResponse };

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

  if (import.meta.env.DEV) {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, refetch: refetchUser, isLoading: isLoadingUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
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
    if (isLoadingUser) {
      return;
    }

    if (!user && pathName.startsWith("/dashboard")) {
      navigate({ to: "/auth", replace: true });
      return;
    }

    if (user && !user.company && pathName.startsWith("/dashboard")) {
      navigate({ to: "/auth/company", replace: true });
      return;
    }

    if (user?.company && pathName.startsWith("/auth")) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
  }, [pathName, navigate, user]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <AuthContext.Provider value={{ loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
