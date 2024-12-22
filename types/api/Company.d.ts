import { Address } from "./Address";
import { Category } from "./Category";
import { FileStorage } from "./FileStorage";

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
  image: FileStorage;
  header?: FileStorage;
  delivery: boolean;
  address: Address;
}
