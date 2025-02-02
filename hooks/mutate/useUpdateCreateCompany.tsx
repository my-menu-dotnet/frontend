import api from "@/services/api";
import { Company } from "@/types/api/Company";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function useUpdateCreateCompany<T>(company?: Company) {
  const router = useRouter();
  return useMutation({
    mutationKey: ["update-create-company"],
    mutationFn: async (data: T) => {
      return await api(`/company`, {
        data,
        method: company?.id ? "PUT" : "POST",
      });
    },
    onError: (error) => {
      toast.error("Erro ao salvar empresa");
      console.error(error);
    },
    onSuccess: () => {
      if (!company?.id) {
        router.push("/auth/company/verify-email");
      }
      toast.success("Empresa salva com sucesso");
    },
  });
}
