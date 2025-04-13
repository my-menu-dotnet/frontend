import { Order, OrderStatus } from "@/@types/api/order/Order";

export function orderOrderByStatus(order: Order[]): Record<keyof OrderStatus, Order[]> {
  const orderByStatus = order.reduce((acc, curr) => {
    const status = curr.status as keyof OrderStatus;
    
    if (!acc[status]) {
      acc[status] = [];
    }
    
    acc[status].push(curr);
    return acc;
  }, {} as Record<keyof OrderStatus, Order[]>);

  return orderByStatus;
}