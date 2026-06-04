import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Client } from "@/types/api/Client";
import { useQuery } from "@tanstack/react-query";

const useClient = (clientId: string | undefined) =>
  useQuery<Client>({
    queryKey: [QUERY_KEY.CLIENT, clientId],
    queryFn: async () => await fetchClient(clientId!),
    enabled: Boolean(clientId),
    retry: false,
  });

const fetchClient = async (clientId: string) => {
  try {
    const { data } = await api.get(`/client/${clientId}`);
    return data as Client;
  } catch (error) {
    console.error(error);
    throw new Error("Client not found");
  }
};

export default useClient;
