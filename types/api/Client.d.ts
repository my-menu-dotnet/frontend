type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: ClientAddress;
  created_at: string;
  updated_at: string;
};

type ClientAddress = {
  id: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
};

type ClientRequest = {
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: ClientRequestAddress;
};

type ClientRequestAddress = {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
};

type ClientFilter = {
  page?: number;
};

export type { Client, ClientAddress, ClientRequest, ClientRequestAddress, ClientFilter };
