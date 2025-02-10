import { Category } from "./Category";
import { Discounts } from "./Discounts";
import { FileStorage } from "./FileStorage";
import { FoodItemCategory } from "./food/FoodItemCategory";

type Food = {
  id: string;
  name: string;
  description: string;
  discounts: Omit<Discounts[], "food">;
  active_discount?: Omit<Discounts, "food">;
  category: Omit<Category, "foods">
  price: number;
  image?: FileStorage;
  status: FoodStatus;
  item_categories: FoodItemCategory[];
  lactose_free: boolean;
  gluten_free: boolean;
  vegan: boolean;
  vegetarian: boolean;
  halal: boolean;
  created_at: string;
  updated_at: string;
};

type FoodStatus = "ACTIVE" | "INACTIVE";

export type { Food, FoodStatus };
