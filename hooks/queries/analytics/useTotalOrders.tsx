import api from "@/services/api";
import { TotalOrders } from "@/types/api/analytics/OrderAnalytics";
import { useQuery } from "@tanstack/react-query";

const useTotalOrders = () => {
  return useQuery<TotalOrders>({
    queryKey: ["orderAnalytics", "total"],
    queryFn: async () => {
      const { data } = await api.get("/analytics/orders/total");
      return data as TotalOrders;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useTotalOrders;
