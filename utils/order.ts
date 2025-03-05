import { OrderStatus } from "@/types/api/order/Order";

export const orderStatusMask = (status: OrderStatus) => {
  switch (status) {
    case "CREATED":
      return "Criado";
    case "ACCEPTED":
      return "Aceito";
    case "PRODUCING":
      return "Em produção";
    case "READY":
      return "Pronto";
    case "DELIVERED":
      return "Entregue";
    case "CANCELLED":
      return "Cancelado";
    default:
      return "";
  }
};

export const orderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "CREATED":
      return "bg-blue-500";
    case "ACCEPTED":
      return "bg-green-500";
    case "PRODUCING":
      return "bg-yellow-500";
    case "READY":
      return "bg-red-500";
    case "DELIVERED":
      return "bg-purple-500";
    case "CANCELLED":
      return "bg-gray-500";
    default:
      return "";
  }
};
