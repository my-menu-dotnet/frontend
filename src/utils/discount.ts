import { OrderItem } from "@/@types/api/order/OrderItem";

export const calcTotalWithoutDiscount = (items: OrderItem[]) => {
  return items.reduce((acc, item) => {
    const currentTotal = item.unit_price * item.quantity;

    return (
      acc +
      currentTotal +
      (item.order_items?.reduce(
        (acc, subItem) => acc + subItem.unit_price * subItem.quantity,
        0
      ) || 0)
    );
  }, 0);
};

export const calcTotalDiscount = (items: OrderItem[]) => {
  return items.reduce((acc, item) => {
    const currentTotal = item.unit_price * item.quantity;
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