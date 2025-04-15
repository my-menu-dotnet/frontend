import { QUERY_KEY } from "@/const/queryKey";
import api from "@/service/api";
import { Category, CategoryFilter } from "@/@types/api/Category";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Page } from "@/@types/api/Page";

const useCategories = ({ page = 0, ...rest }: Partial<CategoryFilter>) => {
  const [filters, setFilters] = useState<CategoryFilter>({
    page: page,
    ...rest
  });

  const query = useQuery<Page<Category> | undefined>({
    queryKey: [QUERY_KEY.CATEGORIES, filters],
    queryFn: async () => {
      return await fetchCategories(filters);
    },
    retry: false,
  });

  return {
    ...query,
    filters,
    setFilters,
  };
};

const fetchCategories = async (filters: CategoryFilter) => {
  try {
    const { data } = await api.get("/category", {
      params: filters,
    });
    return data as Page<Category>;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useCategories;
