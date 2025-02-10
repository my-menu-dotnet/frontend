import { FileStorage } from "../FileStorage";

type FoodItem = {
  id: string;
  title: string;
  description: string;
  price_increase?: number;
  image?: FileStorage;
  order: number;
  created_at: string;
  updated_at: string;
}

export type { FoodItem };