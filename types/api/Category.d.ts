import { FileStorage } from "./FileStorage";

type Category = {
  id: string;
  name: string;
  description: string;
  image: FileStorage;
  status: CategoryStatus;
  created_at: string;
  updated_at: string;
}

type CategoryStatus = "ACTIVE" | "INACTIVE";

export type { Category, CategoryStatus };
