import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const useAuthenticated = () =>
  useQuery<null>({
    queryKey: ["authenticated"],
    queryFn: async () => {
      return await fetchCheckAuthenticated();
    },
    retry: false,
    refetchOnMount: true,
    staleTime: Infinity
  });

const fetchCheckAuthenticated = async (): Promise<null> => {
  return await api.get("/auth/check");
};

export default useAuthenticated;
