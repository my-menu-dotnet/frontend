import { Address } from "./Address";
import { Company } from "./Company";

type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: Address;
  companies: Company[];
  created_at: string;
  updated_at: string;
  verified_email: boolean;
}

export type { User };