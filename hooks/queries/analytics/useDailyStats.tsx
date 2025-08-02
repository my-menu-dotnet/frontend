import api from "@/services/api";
import { DailyStats } from "@/types/api/analytics/OrderAnalytics";
import { useQuery } from "@tanstack/react-query";

const useDailyStats = () => {
  return useQuery<DailyStats[]>({
    queryKey: ["orderAnalytics", "daily"],
    queryFn: async () => {
      const { data } = await api.get("/analytics/orders/daily-stats");
      return data as DailyStats[];
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useDailyStats;
