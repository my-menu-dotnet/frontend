import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Order } from "@/types/api/order/Order";
import { useQuery } from "@tanstack/react-query";

const useOrdersKanban = () =>
  useQuery({
    queryKey: [QUERY_KEY.KANBAN_ORDER],
    queryFn: fetchOrder,
    staleTime: 1000 * 60 * 5,
  });

const fetchOrder = async () => {
  try {
    const { data } = await api.get("/order/kanban");
    return data as Order[];
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useOrdersKanban;
