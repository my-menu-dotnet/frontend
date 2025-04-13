import { QUERY_KEY } from "@/const/queryKey";
import api from "@/service/api";
import { Category } from "@/@types/api/Category";
import { useQuery } from "@tanstack/react-query";

const useCategory = ({ id }: { id: string | undefined }) =>
  useQuery<Category | null>({
    queryKey: [QUERY_KEY.CATEGORY, id],
    queryFn: async () => {
      return await fetchCategory(id);
    },
    retry: false,
    enabled: !!id,
  });

const fetchCategory = async (id: string | undefined) => {
  try {
    if (!id) {
      throw new Error("ID is required");
    }

    const { data } = await api.get(`/category/${id}`);
    return data as Category;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCategory;
