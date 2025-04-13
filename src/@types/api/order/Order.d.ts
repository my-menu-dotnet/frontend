import { Address } from "../Address";
import { User } from "../User";
import { OrderItem } from "./OrderItem";

type Order = {
  id: string;
  table_number: number;
  total_price: number;
  status: OrderStatus;
  order_items: OrderItem[];
  order_number: number;
  order: number;
  user_name: string;
  address: Address;
  user?: User;
  created_at: Date;
  updated_at: Date;
};

type OrderStatus = "CREATED" | "ACCEPTED" | "PRODUCING" | "READY" | "DELIVERED" | "CANCELLED";

export type { Order, OrderStatus };
