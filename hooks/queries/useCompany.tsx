import api from "@/services/api";
import { Company } from "@/types/api/Company";
import { useQuery } from "@tanstack/react-query";

const useCompany = (companyId?: string) =>
  useQuery<Company | null>({
    queryKey: ["company"],
    queryFn: async () => {
      return await fetchCompany(companyId);
    },
    retry: false,
  });

const fetchCompany = async (companyId?: string) => {
  try {
    if (companyId) {
      const { data } = await api.get(`/company/${companyId}`);
      return data as Company;
    }

    const { data } = await api.get("/company/user");
    return (data[0] || {}) as Company;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCompany;
