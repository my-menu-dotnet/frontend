"use client";

import { createContext, ReactNode, useContext } from "react";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/api/User";

type UserContextProps = {
  user: User | undefined;
  refetch: () => void;
};

const UserContext = createContext<UserContextProps>({
  user: undefined,
  refetch: () => null,
});

export function useUser() {
  const value = useContext(UserContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      return await api.get("/user");
    },
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, refetch }}>
      {children}
    </UserContext.Provider>
  );
}
