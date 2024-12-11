import { Category } from "./Category";
import { FileStorage } from "./FileStorage";

type Food = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: FileStorage;
  status: FoodStatus;
  lactose_free: boolean;
  gluten_free: boolean;
  vegan: boolean;
  vegetarian: boolean;
  halal: boolean;
  created_at: string;
  updated_at: string;
}

type FoodStatus = "ACTIVE" | "INACTIVE";

export type { Food, FoodStatus };