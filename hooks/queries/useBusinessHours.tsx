import api from "@/services/api";
import { BusinessHoursResponse } from "@/types/api/BusinessHours";
import { useQuery } from "@tanstack/react-query";

const useBusinessHours = () => {
  return useQuery<BusinessHoursResponse>({
    queryKey: ["businessHours"],
    queryFn: async () => {
      const { data } = await api.get("/company/business-hours");
      return data as BusinessHoursResponse;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useBusinessHours;
