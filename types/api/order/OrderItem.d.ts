import { FileStorage } from "../FileStorage";
import { OrderDiscount } from "./OrderDiscount";

type OrderItem = {
  id: string;
  title: string;
  description: string;
  image: FileStorage;
  category: string;
  quantity: number;
  unit_price: number;
  observation?: string;
  discount?: OrderDiscount;
  user: User;
  company: Company;
  order_items?: OrderItem[];
};

export type { OrderItem };
