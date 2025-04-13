import { PageParams } from "../Page";

type OrderFilter = PageParams & {
  date?: string;
};

export type { OrderFilter };
