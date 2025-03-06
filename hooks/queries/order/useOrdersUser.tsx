import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Order } from "@/types/api/order/Order";
import { Page, PageParams } from "@/types/Page";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useOrdersUser = () => {
  const [filters, setFilters] = useState<PageParams>({
    page: 0,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.ORDER_USER, filters],
    queryFn: async () => await fetchOrder(filters),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    filters,
    setFilters,
  };
};

const fetchOrder = async (filters: PageParams) => {
  try {
    const { data } = await api.get("/order/user", {
      params: filters,
    });
    return data as Page<Order>;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useOrdersUser;
