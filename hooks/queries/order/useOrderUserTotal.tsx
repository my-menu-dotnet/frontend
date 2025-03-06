import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { OrderTotal } from "@/types/api/order/OrderTotal";
import { useQuery } from "@tanstack/react-query";

const useOrderUserTotal = () =>
  useQuery({
    queryKey: [QUERY_KEY.ORDER_USER],
    queryFn: async () => await fetchOrder(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

const fetchOrder = async () => {
  try {
    const { data } = await api.get("/order/user/total");
    return data as OrderTotal;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useOrderUserTotal;
