import { Discounts } from "@/types/api/Discounts";

export const calculateDiscount = (
  food: { price: number },
  discount: {
    discount: Discounts["discount"];
    type: Discounts["type"];
  }
) => {
  return discount.type === "AMOUNT"
    ? food.price - discount.discount
    : food.price - (food.price * discount.discount) / 100;
};
