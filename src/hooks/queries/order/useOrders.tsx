import { QUERY_KEY } from "@/const/queryKey";
import api from "@/service/api";
import { Order } from "@/@types/api/order/Order";
import { Page } from "@/@types/api/Page";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { OrderFilter } from "@/@types/api/order/OrderFilter";

const useOrders = ({ date, page = 0 }: Partial<OrderFilter>) => {
  const [filters, setFilters] = useState<OrderFilter>({
    page: page,
    date: date,
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.ORDERS],
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

const fetchOrder = async (filters: OrderFilter) => {
  try {
    const { data } = await api.get("/order", {
      params: filters,
    });
    return data as Page<Order>;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useOrders;
