import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Food } from "@/types/api/Food";
import { Page } from "@/types/Page";
import { useInfiniteQuery } from "@tanstack/react-query";

const useInfiniteFood = () =>
  useInfiniteQuery<Page<Food>>({
    queryKey: [QUERY_KEY.INFINITE_FOOD_SELECT],
    queryFn: async ({ pageParam = 0 }) => await fetchFoodSelect(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage?.page.number < lastPage?.page.total_pages
        ? lastPage.page.total_pages + 1
        : null;
    },
    initialPageParam: 0,
    retry: false,
  });

const fetchFoodSelect = async (page: unknown): Promise<Page<Food>> => {
  try {
    const { data } = await api.get(`/food`, {
      params: {
        page,
      },
    });
    return data as Page<Food>;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useInfiniteFood;
