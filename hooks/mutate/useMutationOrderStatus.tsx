import api from "@/services/api";
import { Order, OrderStatus } from "@/types/api/order/Order";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import useOrders from "../queries/order/useOrders";
import useOrdersKanban from "../queries/order/useOrdersKanban";

const useMutationOrderStatus = () => {
  const { refetch: refetchOrders } = useOrdersKanban();

  return useMutation<
    AxiosResponse<Order>,
    AxiosError<unknown>,
    { orderId: string; new_order: number, status: OrderStatus }
  >({
    mutationFn: ({
      orderId,
      new_order,
      status,
    }: {
      orderId: string;
      new_order: number;
      status: OrderStatus;
    }) =>
      api.patch(`/order/${orderId}`, {
        new_order: new_order,
        status: status,
      }),
    onSuccess: () => {
      refetchOrders();
    },
  });
};

export default useMutationOrderStatus;
