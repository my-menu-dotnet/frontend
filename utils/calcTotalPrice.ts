import { FoodOrder } from "@/hooks/useCart";

export const calcTotalPrice = (items: FoodOrder[]) => {
  return items.reduce((acc, item) => {
    const currentTotal = item.price * item.quantity;
    let currentoTotalWithDiscount = currentTotal;

    if (item.discount && item.discount.discount && item.discount.type) {
      if (item.discount.type === "PERCENTAGE") {
        currentoTotalWithDiscount =
          currentTotal - (currentTotal * item.discount.discount) / 100;
      } else {
        currentoTotalWithDiscount = currentTotal - item.discount.discount;
      }
    }

    return (
      acc +
      currentoTotalWithDiscount +
      item.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }, 0);
};

export const calcTotalWithoutDiscount = (items: FoodOrder[]) => {
  return items.reduce((acc, item) => {
    const currentTotal = item.price * item.quantity;

    return (
      acc +
      currentTotal +
      item.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }, 0);
};

export const calcTotalDiscount = (items: FoodOrder[]) => {
  return items.reduce((acc, item) => {
    const currentTotal = item.price * item.quantity;
    let currentoTotalWithDiscount = currentTotal;

    if (item.discount && item.discount.discount && item.discount.type) {
      if (item.discount.type === "PERCENTAGE") {
        currentoTotalWithDiscount =
          currentTotal - (currentTotal * item.discount.discount) / 100;
      } else {
        currentoTotalWithDiscount = currentTotal - item.discount.discount;
      }
    }

    return acc + (currentTotal - currentoTotalWithDiscount);
  }, 0);
};
