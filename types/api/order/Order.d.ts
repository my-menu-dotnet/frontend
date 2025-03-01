import { Company } from "../Company";
import { OrderItem } from "./OrderItem";

type Order = {
  id: string;
  table_number: number;
  total_price: number;
  status: OrderStatus;
  order_items: OrderItem[];
  company: Company;
  created_at: Date;
  updated_at: Date;
};

type OrderStatus = "SUCCESS" | "PENDING" | "FAILURE";

export type { Order, OrderStatus };
