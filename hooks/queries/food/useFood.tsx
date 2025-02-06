import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Food } from "@/types/api/Food";
import { useQuery } from "@tanstack/react-query";

const useFood = (foodId: string) =>
  useQuery<Food | null >({
    queryKey: [QUERY_KEY.FOOD],
    queryFn: async () => await fetchFood(foodId),
    retry: false,
  });

const fetchFood = async (foodId: string) => {
  try {
    const { data } = await api.get(`/food/${foodId}`);
    return data as Food;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useFood;
