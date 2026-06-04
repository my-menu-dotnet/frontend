import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Client, ClientFilter } from "@/types/api/Client";
import { Page } from "@/types/Page";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useClients = () => {
  const [filters, setFilters] = useState<ClientFilter>({
    page: 0,
  });

  const query = useQuery<Page<Client>>({
    queryKey: [QUERY_KEY.CLIENTS, filters],
    queryFn: async () => await fetchClients(filters),
    retry: false,
    staleTime: 1000 * 60,
  });

  return {
    ...query,
    filters,
    setFilters,
  };
};

const fetchClients = async (filter: ClientFilter) => {
  try {
    const { data } = await api.get("/client", { params: filter });
    return data as Page<Client>;
  } catch (error) {
    console.error(error);
    throw new Error("Clients not found");
  }
};

export default useClients;
