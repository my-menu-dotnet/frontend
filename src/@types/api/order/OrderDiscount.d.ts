import { DiscountsType } from "../Discounts";

type OrderDiscount = {
  id: string;
  discount: number;
  type: DiscountsType;
  startAt: string;
  endAt: string;
};

export type { OrderDiscount };
