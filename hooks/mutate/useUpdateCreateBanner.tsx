import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Company } from "@/types/api/Company";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useUpdateCreateBanner<T>(company?: Company) {
  return useMutation({
    mutationKey: [QUERY_KEY.UPDATE_CREATE_BANNER],
    mutationFn: async (data: T) =>
      !company?.id
        ? await api.post(`/banner`, {
            ...data,
          })
        : await api.put(`/banner/${company.id}`, {
            ...data,
          }),
    onError: (error) => {
      toast.error("Erro ao criar banner");
      console.error(error);
    },
  });
}
