import api from "@/services/api";
import { Order } from "@/types/api/order/Order";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const useMutationOrder = (cooldownPeriod = 60000) => {
  const [lastSuccessTime, setLastSuccessTime] = useState<number | null>(null);
  console.log(lastSuccessTime)

  return useMutation<
    Order,
    unknown,
    { orderItemForm: OrderItemForm[]; total: number }
  >({
    mutationKey: ["order"],
    mutationFn: async ({
      orderItemForm,
      total,
    }: {
      orderItemForm: OrderItemForm[];
      total: number;
    }) => {
      if (lastSuccessTime && Date.now() - lastSuccessTime < cooldownPeriod) {
        throw new Error(
          `Por favor, aguarde ${
            cooldownPeriod / 1000
          } segundos entre requisições`
        );
      }
      return fetchOrder(orderItemForm, total);
    },
    onSuccess: () => {
      setLastSuccessTime(Date.now());
    },
    retry: false,
  });
};

const fetchOrder = async (orderItemForm: OrderItemForm[], total: number) => {
  try {
    const { data } = await api.post("/order", orderItemForm, {
      params: {
        total,
      },
    });
    return data as Order;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
};

export default useMutationOrder;
