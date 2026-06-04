import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Client, ClientRequest } from "@/types/api/Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY.UPDATE_CREATE_CLIENT],
    mutationFn: async (data: ClientRequest & { id?: string }) => {
      if (data.id) {
        const { id, ...payload } = data;
        const response = await api.put<Client>(`/client/${id}`, payload);
        return response.data;
      }
      const response = await api.post<Client>("/client", data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CLIENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CLIENT] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CLIENT_SEARCH] });
      toast.success(variables.id ? "Cliente atualizado com sucesso" : "Cliente criado com sucesso");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao salvar cliente");
    },
  });
};

export default useUpdateCreateClient;
