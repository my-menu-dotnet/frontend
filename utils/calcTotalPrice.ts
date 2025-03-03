import { FoodOrder } from "@/hooks/useCart";

export const calcTotalPrice = (items: FoodOrder[]) => {
  return items.reduce((acc, item) => {
    return (
      acc +
      item.price * item.quantity +
      item.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }, 0);
};
