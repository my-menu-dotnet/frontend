import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useAuth, AuthProvider } from "./useAuth";
import * as useUserModule from "@/hooks/queries/useUser";

const navigateMock = vi.fn();
const locationPath = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({ pathname: locationPath() }),
}));

vi.mock("js-cookie", () => ({
  default: {
    remove: vi.fn(),
    set: vi.fn(),
    get: vi.fn(),
  },
}));

import Cookies from "js-cookie";

const makeUser = (overrides = {}) => ({
  id: "u1",
  email: "user@example.com",
  name: "Test User",
  company: null,
  ...overrides,
});

const mockUseUser = (overrides: Partial<ReturnType<typeof useUserModule.default>> = {}) => {
  vi.spyOn(useUserModule, "default").mockReturnValue({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    company: undefined,
    ...overrides,
  } as any);
};

const renderWithAuth = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
  return renderHook(() => useAuth(), { wrapper });
};

describe("useAuth", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    locationPath.mockReturnValue("/somewhere");
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns loginGoogle and logout from context", () => {
    mockUseUser({ data: null, isLoading: true });
    const { result } = renderWithAuth();
    expect(result.current.loginGoogle).toBeDefined();
    expect(result.current.logout).toBeDefined();
    expect(result.current.loginGoogle.mutate).toBeInstanceOf(Function);
    expect(result.current.logout.mutate).toBeInstanceOf(Function);
  });

  it("loginGoogle posts to /v1/oauth/google with credential", async () => {
    mockUseUser({ data: null, isLoading: true });
    const { result } = renderWithAuth();
    await act(async () => {
      await result.current.loginGoogle.mutateAsync({
        credential: "fake-google-credential",
      });
    });
    await waitFor(() => {
      expect(result.current.loginGoogle.isSuccess).toBe(true);
    });
  });

  it("logout posts to /v1/oauth/logout", async () => {
    mockUseUser({ data: makeUser(), isLoading: false });
    const { result } = renderWithAuth();
    await act(async () => {
      await result.current.logout.mutateAsync();
    });
    await waitFor(() => {
      expect(result.current.logout.isSuccess).toBe(true);
    });
  });

  it("logout removes is_authenticated cookie", async () => {
    mockUseUser({ data: makeUser(), isLoading: false });
    const { result } = renderWithAuth();
    await act(async () => {
      await result.current.logout.mutateAsync();
    });
    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith("is_authenticated");
    });
  });

  it("redirects unauthenticated user from /dashboard to /auth", async () => {
    mockUseUser({ data: null, isLoading: false });
    locationPath.mockReturnValue("/dashboard");
    renderWithAuth();
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/auth",
        replace: true,
      });
    });
  });

  it("redirects user without company from /dashboard to /auth/company", async () => {
    mockUseUser({ data: makeUser({ company: null }), isLoading: false });
    locationPath.mockReturnValue("/dashboard");
    renderWithAuth();
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/auth/company",
        replace: true,
      });
    });
  });

  it("redirects user with company from /auth to /dashboard", async () => {
    mockUseUser({
      data: makeUser({ company: { id: "c1", name: "Acme" } }),
      isLoading: false,
    });
    locationPath.mockReturnValue("/auth");
    renderWithAuth();
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/dashboard",
        replace: true,
      });
    });
  });

  it("does not redirect while user is loading", () => {
    mockUseUser({ data: null, isLoading: true });
    locationPath.mockReturnValue("/dashboard");
    renderWithAuth();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("does not redirect when authenticated user is on /dashboard", () => {
    mockUseUser({
      data: makeUser({ company: { id: "c1", name: "Acme" } }),
      isLoading: false,
    });
    locationPath.mockReturnValue("/dashboard");
    renderWithAuth();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("does not redirect when unauthenticated user is on public path", () => {
    mockUseUser({ data: null, isLoading: false });
    locationPath.mockReturnValue("/menu/abc");
    renderWithAuth();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
