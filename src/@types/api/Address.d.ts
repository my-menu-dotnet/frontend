type Address = {
  id: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  zip_code: string;
  created_at: string;
  updated_at: string;
};

type AddressRequest = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
};

export type { Address, AddressRequest };
