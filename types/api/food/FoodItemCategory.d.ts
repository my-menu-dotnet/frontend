import { FoodItem } from "./FoodItem";

type FoodItemCategory = {
  id: string;
  title: string;
  description: string;
  min_items: number;
  max_items: number;
  required: boolean;
  food_items: FoodItem[];
  order: number;
  created_at: string;
  updated_at: string;
}

export type { FoodItemCategory };