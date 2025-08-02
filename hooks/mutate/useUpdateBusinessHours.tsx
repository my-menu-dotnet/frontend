import api from "@/services/api";
import { BusinessHoursRequest } from "@/types/api/BusinessHours";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateBusinessHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessHours: BusinessHoursRequest) => {
      const { data } = await api.put("/company/business-hours", businessHours);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessHours"] });
      toast.success("Horários de funcionamento atualizados com sucesso!");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error("Erro ao atualizar horários:", error);
      toast.error(
        error.response?.data?.message || 
        "Erro ao atualizar horários de funcionamento"
      );
    },
  });
};

export default useUpdateBusinessHours;
