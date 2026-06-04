import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Client } from "@/types/api/Client";
import { useQuery } from "@tanstack/react-query";

const useSearchClients = (name: string) =>
  useQuery<Client[]>({
    queryKey: [QUERY_KEY.CLIENT_SEARCH, name],
    queryFn: async () => await searchClients(name),
    enabled: name.trim().length >= 2,
    retry: false,
    staleTime: 1000 * 30,
  });

const searchClients = async (name: string) => {
  try {
    const { data } = await api.get("/client/search", {
      params: { name },
    });
    return data as Client[];
  } catch (error) {
    console.error(error);
    throw new Error("Clients not found");
  }
};

export default useSearchClients;
