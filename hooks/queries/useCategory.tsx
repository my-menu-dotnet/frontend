import api from "@/services/api";
import { Category } from "@/types/api/Category";
import { useQuery } from "@tanstack/react-query";

const useCategory = () =>
  useQuery<Category[] | null>({
    queryKey: ["category"],
    queryFn: async () => {
      return await fetchCategory();
    },
    retry: false,
  });

const fetchCategory = async () => {
  try {
    const { data } = await api.get("/category/me");
    return data as Category[];
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCategory;
