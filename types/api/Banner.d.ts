import { Company } from "./Company";
import { FileStorage } from "./FileStorage";

type Banner = {
  id: string;
  image: FileStorage;
  redirect: BannerRedirect;
  url: string;
  order: number;
  active: boolean;
  company: Company;
  created_at: string;
  updated_at: string;
};

type BannerRedirect = "URL" | "CATEGORY" | "PRODUCT" | "MENU";

export type { Banner, BannerRedirect };
