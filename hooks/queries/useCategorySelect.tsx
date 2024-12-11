import api from "@/services/api";
import { Select } from "@/types/api/Select";
import { useQuery } from "@tanstack/react-query";

const useCategorySelect = () =>
  useQuery<Select | null>({
    queryKey: ["category-select"],
    queryFn: async () => {
      return await fetchCategorySelect();
    },
    retry: false,
  });

const fetchCategorySelect = async () => {
  try {
    const { data } = await api.get("/category/select");
    return data as Select;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCategorySelect;
