type OrderItem = {
  id: string;
  title: string;
  description: string;
  image: FileStorage;
  category: string;
  quantity: number;
  unit_price: number;
  user: User;
  company: Company;
};

export type { OrderItem };
