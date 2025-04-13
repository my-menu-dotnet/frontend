import { Category } from "./Category";
import { Company } from "./Company";
import { FileStorage } from "./FileStorage";
import { Food } from "./Food";

type Banner = {
  id: string;
  title: string;
  description?: string;
  image: FileStorage;
  redirect: BannerRedirect;
  category?: Category;
  food?: Food;
  url?: string;
  type: BannerType;
  order: number;
  active: boolean;
  company: Company;
  created_at: string;
  updated_at: string;
};

type BannerRedirect = "URL" | "CATEGORY" | "FOOD";
type BannerType = "MOBILE" | "DESKTOP";

export type { Banner, BannerRedirect, BannerType };
