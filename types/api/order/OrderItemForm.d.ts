type OrderItemForm = {
  item_id: string;
  quantity: number;
  items: Omit<OrderItemForm, "items">[];
};

export type { OrderItemForm };