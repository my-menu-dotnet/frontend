import api from "@/services/api";
import { Address } from "@/types/api/Address";
import { Order } from "@/types/api/order/Order";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import { useMutation } from "@tanstack/react-query";

export type OrderCraeteForm = {
  user_name: string;
  company_observation: string;
  order_items: OrderItemForm[];
  address: Partial<Address>;
};

export function useMutationOrderAnonymous() {
  return useMutation({
    mutationFn: (body: OrderCraeteForm) => postOrderAnonymous(body),
  })
}

const postOrderAnonymous = async (body: OrderCraeteForm) => {
  try {
    const { data } = await api.post("/order/anonymously", body);
    return data as Order;
  } catch (error) {
    console.error(error);
    throw new Error("Company not found");
  }
}