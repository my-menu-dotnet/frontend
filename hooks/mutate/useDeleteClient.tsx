import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      await api.delete(`/client/${clientId}`);
      return clientId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CLIENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CLIENT_SEARCH] });
      toast.success("Cliente removido com sucesso");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao remover cliente");
    },
  });
};

export default useDeleteClient;
