import { Food } from "./Food";
import { PageParams } from "./Page";

type Category = {
  id: string;
  order: number;
  name: string;
  foods: Food[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

type CategoryFilter = PageParams<Category>;

export type { Category, CategoryFilter, CategoryStatus };
