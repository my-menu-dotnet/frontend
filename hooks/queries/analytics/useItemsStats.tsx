import api from "@/services/api";
import { ItemStats } from "@/types/api/analytics/OrderAnalytics";
import { useQuery } from "@tanstack/react-query";

const useItemsStats = (months: number = 1) => {
  return useQuery<ItemStats[]>({
    queryKey: ["orderAnalytics", "items", months],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/orders/items-stats?months=${months}`);
      return data as ItemStats[];
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useItemsStats;
