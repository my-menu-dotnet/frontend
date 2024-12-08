import { Address } from "./Address";
import { Category } from "./Category";
import { FileStorage } from "./FileStorage";

type Company = {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  verified_email: boolean;
  categories: Category[];
  image: FileStorage;
  delivery: boolean;
  address: Address;
}
