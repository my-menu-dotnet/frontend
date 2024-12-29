import api from "@/services/api";
import { Discounts } from "@/types/api/Discounts";
import { useQuery } from "@tanstack/react-query";

const useDiscount = (discountId: string | null) =>
  useQuery<Discounts | null>({
    queryKey: ["discount"],
    queryFn: async () => {
      return await fetchDiscounts(discountId);
    },
    retry: false,
    enabled: !!discountId,
  });

const fetchDiscounts = async (discountId: string | null) => {
  if (!discountId) {
    return null;
  }

  try {
    const { data } = await api.get(`/discount/${discountId}`);
    return data as Discounts;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useDiscount;
