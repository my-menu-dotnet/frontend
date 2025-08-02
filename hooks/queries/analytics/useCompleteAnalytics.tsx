import api from "@/services/api";
import { CompleteOrderAnalytics } from "@/types/api/analytics/OrderAnalytics";
import { useQuery } from "@tanstack/react-query";

const useCompleteAnalytics = (itemStatsPeriodMonths: number = 1) => {
  return useQuery<CompleteOrderAnalytics>({
    queryKey: ["orderAnalytics", "complete", itemStatsPeriodMonths],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/orders/complete-analytics?itemStatsPeriodMonths=${itemStatsPeriodMonths}`);
      return data as CompleteOrderAnalytics;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useCompleteAnalytics;
