import { Order } from "@/@types/api/order/Order";

export function getLateStatus(order: Order) {
  const time = new Date().getTime() - new Date(order.created_at).getTime();
  if (order.status !== "READY" && order.status !== "DELIVERED") {
    if (time >= 1000 * 60 * 30) {
      return "DANGER";
    } else if (time >= 1000 * 60 * 20) {
      return "WARNING";
    }
  }
}