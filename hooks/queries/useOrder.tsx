import api from "@/services/api";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import { Preference } from "@/types/api/order/Preference";
import { useMutation } from "@tanstack/react-query";

const useMutationOrder = () =>
  useMutation<
    Preference,
    unknown,
    { orderItemForm: OrderItemForm[]; total: number }
  >({
    mutationFn: ({
      orderItemForm,
      total,
    }: {
      orderItemForm: OrderItemForm[];
      total: number;
    }) => fetchOrder(orderItemForm, total),
    retry: false,
  });

const fetchOrder = async (orderItemForm: OrderItemForm[], total: number) => {
  try {
    const { data } = await api.post("/order", orderItemForm, {
      params: {
        total,
      },
    });
    return data as Preference;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useMutationOrder;
