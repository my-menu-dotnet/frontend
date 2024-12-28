import { Company } from "./Company";

type Discounts = {
  id: string;
  company: Company;
  discount: number;
  start_at?: string;
  end_at?: string;
  status: DiscountsStatus;
  type: DiscountsType;
  created_at: string;
  updated_at: string;
};

type DiscountsStatus = "ACTIVE" | "INACTIVE";
type DiscountsType = "PERCENTAGE" | "AMOUNT";

export type { Discounts, DiscountsStatus, DiscountsType };
