type OrderItemForm = {
  item_id: string;
  quantity: number;
  discount_id?: string;
  observation?: string;
  items: Omit<OrderItemForm, "items">[];
};

export type { OrderItemForm };