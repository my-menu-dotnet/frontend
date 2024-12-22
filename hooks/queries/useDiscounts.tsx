import api from "@/services/api";
import { Discounts } from "@/types/api/Discounts";
import { useQuery } from "@tanstack/react-query";

const useDiscounts = () =>
  useQuery<Discounts[] | null>({
    queryKey: ["discounts"],
    queryFn: async () => {
      return await fetchDiscounts();
    },
    retry: false,
  });

const fetchDiscounts = async () => {
  try {
    const { data } = await api.get("/discount");
    return data as Discounts[];
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useDiscounts;
