/**
 * Local mock types used by the test factories. These intentionally diverge
 * from the real API types (e.g. `HomeResponse`, `Company`) so that tests can
 * exercise the UI without depending on the production schemas.
 */
type CompanyFactory = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  description: string;
  logo: string;
  phone: string;
  email: string;
  cnpj: string;
  address: AddressFactory;
  open: boolean;
};

type AddressFactory = {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};

type BannerFactory = {
  id: string;
  name: string;
  imageUrl: string;
  active: boolean;
  order: number;
};

type CategoryFactory = {
  id: string;
  name: string;
  description: string;
  order: number;
  active: boolean;
};

type FoodFactory = {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice: number;
  image: string;
  category: CategoryFactory;
  active: boolean;
  order: number;
};

type DiscountFactory = {
  id: string;
  name: string;
  percentage: number;
  active: boolean;
};

type MenuFactory = {
  id: string;
  company: CompanyFactory;
  categories: CategoryFactory[];
  foods: FoodFactory[];
  banners: BannerFactory[];
};

type OrderFactoryItem = {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observations: string;
};

type OrderFactory = {
  id: string;
  companyId: string;
  userId: string;
  items: OrderFactoryItem[];
  total: number;
  status: "PENDING" | "ACCEPTED" | "PRODUCING" | "READY" | "DELIVERED" | "CANCELLED";
  createdAt: string;
};

type UserFactory = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: "CUSTOMER";
};

type ClientFactory = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

type AuthResponseFactory = {
  accessToken: string;
  refreshToken: string;
  user: UserFactory;
};

type BusinessHoursFactoryDay = {
  open: string;
  close: string;
  closed: boolean;
};

type BusinessHoursFactory = {
  monday: BusinessHoursFactoryDay;
  tuesday: BusinessHoursFactoryDay;
  wednesday: BusinessHoursFactoryDay;
  thursday: BusinessHoursFactoryDay;
  friday: BusinessHoursFactoryDay;
  saturday: BusinessHoursFactoryDay;
  sunday: BusinessHoursFactoryDay;
};

type HomeResponseFactory = {
  company: CompanyFactory;
  banners: BannerFactory[];
};

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

let counter = 0;
const id = (prefix = "id") => `${prefix}-${++counter}`;

export const factory = {
  homeResponse(
    overrides: DeepPartial<HomeResponseFactory> = {},
  ): HomeResponseFactory {
    return {
      company: this.company(),
      banners: [this.banner()],
      ...overrides,
    } as HomeResponseFactory;
  },

  company(overrides: DeepPartial<CompanyFactory> = {}): CompanyFactory {
    return {
      id: id("comp"),
      name: "Pizzaria do João",
      slug: "pizzaria-do-joao",
      domain: "pizzaria.my-menu.net",
      description: "A melhor pizza da cidade",
      logo: "https://placehold.co/200x200",
      phone: "11999999999",
      email: "contato@pizzaria.com",
      cnpj: "12345678000190",
      address: this.address(),
      open: true,
      ...overrides,
    } as CompanyFactory;
  },

  address(overrides: DeepPartial<AddressFactory> = {}): AddressFactory {
    return {
      id: id("addr"),
      cep: "01310100",
      street: "Avenida Paulista",
      number: "1000",
      complement: "Sala 101",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      ...overrides,
    } as AddressFactory;
  },

  banner(overrides: DeepPartial<BannerFactory> = {}): BannerFactory {
    return {
      id: id("ban"),
      name: "Promoção de Pizza",
      imageUrl: "https://placehold.co/1200x400",
      active: true,
      order: 1,
      ...overrides,
    } as BannerFactory;
  },

  category(overrides: DeepPartial<CategoryFactory> = {}): CategoryFactory {
    return {
      id: id("cat"),
      name: "Pizzas",
      description: "Pizzas tradicionais",
      order: 1,
      active: true,
      ...overrides,
    } as CategoryFactory;
  },

  food(overrides: DeepPartial<FoodFactory> = {}): FoodFactory {
    return {
      id: id("food"),
      name: "Pizza Margherita",
      description: "Molho de tomate, mussarela de búfala, manjericão fresco",
      price: 49.9,
      promotionalPrice: 39.9,
      image: "https://placehold.co/400x400",
      category: this.category(),
      active: true,
      order: 1,
      ...overrides,
    } as FoodFactory;
  },

  foodList(count: number, overrides: DeepPartial<FoodFactory> = {}): FoodFactory[] {
    return Array.from({ length: count }, () => this.food(overrides));
  },

  discount(overrides: DeepPartial<DiscountFactory> = {}): DiscountFactory {
    return {
      id: id("disc"),
      name: "Desconto de 10%",
      percentage: 10,
      active: true,
      ...overrides,
    } as DiscountFactory;
  },

  menu(overrides: DeepPartial<MenuFactory> = {}): MenuFactory {
    return {
      id: id("menu"),
      company: this.company(),
      categories: [this.category(), this.category({ id: "cat-2", name: "Bebidas" })],
      foods: this.foodList(4),
      banners: [this.banner()],
      ...overrides,
    } as MenuFactory;
  },

  emptyMenu(overrides: DeepPartial<MenuFactory> = {}): MenuFactory {
    return {
      id: id("menu"),
      company: this.company(),
      categories: [],
      foods: [],
      banners: [],
      ...overrides,
    } as MenuFactory;
  },

  order(overrides: DeepPartial<OrderFactory> = {}): OrderFactory {
    return {
      id: id("ord"),
      companyId: "comp-1",
      userId: "user-1",
      items: [
        {
          id: id("item"),
          foodId: "food-1",
          foodName: "Pizza Margherita",
          quantity: 2,
          unitPrice: 49.9,
          totalPrice: 99.8,
          observations: "Sem cebola",
        },
      ],
      total: 99.8,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...overrides,
    } as OrderFactory;
  },

  orderList(count: number, overrides: DeepPartial<OrderFactory> = {}): OrderFactory[] {
    return Array.from({ length: count }, () => this.order(overrides));
  },

  user(overrides: DeepPartial<UserFactory> = {}): UserFactory {
    return {
      id: id("user"),
      name: "João da Silva",
      email: "joao@example.com",
      phone: "11999999999",
      cpf: "12345678900",
      role: "CUSTOMER",
      ...overrides,
    } as UserFactory;
  },

  client(overrides: DeepPartial<ClientFactory> = {}): ClientFactory {
    return {
      id: id("cli"),
      name: "Maria Souza",
      email: "maria@example.com",
      phone: "11988888888",
      createdAt: new Date().toISOString(),
      ...overrides,
    } as ClientFactory;
  },

  authResponse(overrides: DeepPartial<AuthResponseFactory> = {}): AuthResponseFactory {
    return {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: this.user(),
      ...overrides,
    } as AuthResponseFactory;
  },

  businessHours(overrides: DeepPartial<BusinessHoursFactory> = {}): BusinessHoursFactory {
    return {
      monday: { open: "18:00", close: "23:00", closed: false },
      tuesday: { open: "18:00", close: "23:00", closed: false },
      wednesday: { open: "18:00", close: "23:00", closed: false },
      thursday: { open: "18:00", close: "23:00", closed: false },
      friday: { open: "18:00", close: "23:00", closed: false },
      saturday: { open: "18:00", close: "00:00", closed: false },
      sunday: { open: "00:00", close: "00:00", closed: true },
      ...overrides,
    } as BusinessHoursFactory;
  },

  dailyStats() {
    return {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
      data: [12, 19, 8, 15, 22, 30, 25],
    };
  },

  itemsStats() {
    return {
      labels: ["Pizza Margherita", "Pizza Calabresa", "Refrigerante"],
      data: [40, 35, 25],
    };
  },

  completeAnalytics() {
    return {
      totalOrders: 128,
      totalRevenue: 12800,
      averageOrderValue: 100,
      topItems: ["Pizza Margherita", "Pizza Calabresa"],
      dailyStats: this.dailyStats(),
      itemsStats: this.itemsStats(),
    };
  },
};
