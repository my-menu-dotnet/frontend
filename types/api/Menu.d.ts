import { Category } from "../Category";
import { Company } from "../Company";
import { MenuCategory } from "./MenuCategory";

type Menu = {
  company: Company;
  categories: Category[];
};

export type { Menu };
