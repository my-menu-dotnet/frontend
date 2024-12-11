import { FileStorage } from "./FileStorage";
import { Food } from "./Food";

type Category = {
  id: string;
  order: number;
  name: string;
  description: string;
  image: FileStorage;
  status: CategoryStatus;
  foods: Food[];
  created_at: string;
  updated_at: string;
}

type CategoryStatus = "ACTIVE" | "INACTIVE";

export type { Category, CategoryStatus };
