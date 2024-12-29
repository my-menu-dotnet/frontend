import { Discounts } from "@/types/api/Discounts";
import { Food } from "@/types/api/Food";

export const calculateDiscount = (food: Food, discount: Discounts) => {
  return discount.type === "AMOUNT"
    ? food.price - discount.discount
    : food.price - (food.price * discount.discount) / 100;
};
