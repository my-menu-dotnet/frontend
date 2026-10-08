import {
  createContext,
  ReactNode,
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
import { isMissingCompanyError } from "@/utils/auth";

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
  const { data: user, error: userError, isLoading: isLoadingUser } = useUser();
  const requiresCompany = isMissingCompanyError(userError) || Boolean(user && !user.company);
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
    onSuccess: async ({ data: authenticatedUser }) => {
      // Cancel a pre-login /user request before replacing its cache with the
      // authoritative user returned by Google login (company can be null).
      await queryClient.cancelQueries({ queryKey: ["user"], exact: true });
      queryClient.setQueryData(["user"], authenticatedUser);
    },
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

  useEffect(() => {
    if (isLoadingUser) {
      return;
    }

    if (
      requiresCompany &&
      (pathName.startsWith("/dashboard") || pathName === "/auth" || pathName === "/auth/")
    ) {
      navigate({ to: "/auth/company", replace: true });
      return;
    }

    if (!user && pathName.startsWith("/dashboard")) {
      navigate({ to: "/auth", replace: true });
      return;
    }

    if (!requiresCompany && user?.company && pathName.startsWith("/auth")) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
  }, [isLoadingUser, pathName, navigate, user, requiresCompany]);

  return (
    <AuthContext.Provider value={{ loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
