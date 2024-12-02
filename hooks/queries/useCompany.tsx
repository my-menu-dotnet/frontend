import api from "@/services/api";
import { Company } from "@/types/api/Company";
import { useQuery } from "@tanstack/react-query";

const useCompany = () =>
  useQuery<Company | null>({
    queryKey: ["company"],
    queryFn: async () => {
      return await fetchCompany();
    },
    retry: false,
  });

const fetchCompany = async () => {
  try {
    const { data } = await api.get("/company/user");
    return (data[0] || {}) as Company;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCompany;
