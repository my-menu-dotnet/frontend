import { Category } from "../Category";
import { Company } from "../Company";
import { Banner } from "./Banner";
import { MenuCategory } from "./MenuCategory";

type Menu = {
  company: Company;
  categories: Category[];
  banners: Banner[];
};

export type { Menu };
