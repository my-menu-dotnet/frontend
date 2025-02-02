import api from "@/services/api";
import { TotalCompanyAccess } from "@/types/api/analytics/TotalCompanyAccess";
import { useQuery } from "@tanstack/react-query";
import useUser from "../useUser";

const useCompanyAccess = () => {
  const { company } = useUser();
  const companyId = company?.id;

  return useQuery<TotalCompanyAccess | null>({
    queryKey: ["companyAccess", companyId],
    queryFn: async () => {
      return await fetchCompany(companyId);
    },
    retry: false,
    enabled: !!companyId,
  });
};

const fetchCompany = async (companyId?: string) => {
  try {
    const { data } = await api.get(
      `/analytics/company/total-access/${companyId}`
    );
    return data as TotalCompanyAccess;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCompanyAccess;
