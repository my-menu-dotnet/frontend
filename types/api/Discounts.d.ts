import { Company } from "./Company";
import { Food } from "./Food";

type Discounts = {
  id: string;
  food: Omit<Food, "discounts">;
  discount: number;
  start_at?: string;
  end_at?: string;
  status: DiscountsStatus;
  active: boolean;
  type: DiscountsType;
  created_at: string;
  updated_at: string;
};

type DiscountsStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "EXPIRED";
type DiscountsType = "PERCENTAGE" | "AMOUNT";

export type { Discounts, DiscountsStatus, DiscountsType };
