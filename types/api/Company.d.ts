import { Address } from "./Address";
import { BusinessHours } from "./BusinessHours";
import { Category } from "./Category";

type Company = {
  id: string;
  name: string;
  description: string;
  cnpj: string;
  phone: string;
  url: string;
  primary_color?: string;
  email: string;
  verified_email: boolean;
  categories: Category[];
  business_hours: BusinessHours[];
  image: string;
  header?: string;
  delivery: boolean;
  address: Address;
};
