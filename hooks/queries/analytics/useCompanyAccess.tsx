import api from "@/services/api";
import { TotalCompanyAccess } from "@/types/api/analytics/TotalCompanyAccess";
import { useQuery } from "@tanstack/react-query";
import useUser from "../useUser";

const useCompanyAccess = () => {
  return useQuery<TotalCompanyAccess | null>({
    queryKey: ["companyAccess"],
    queryFn: async () => {
      return await fetchCompany();
    },
    retry: false,
    staleTime: Infinity,
  });
};

const fetchCompany = async () => {
  try {
    const { data } = await api.get(`/analytics/company/total-access`);
    return data as TotalCompanyAccess;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCompanyAccess;
