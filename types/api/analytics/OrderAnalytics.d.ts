type TotalOrders = {
  total_orders: number;
};

type ItemStats = {
  item_title: string;
  total_ordered: number;
};

type DailyStats = {
  date: string;
  total_orders: number;
};

type CompleteOrderAnalytics = {
  total_orders: number;
  item_stats: ItemStats[];
  daily_stats: DailyStats[];
};

export type { TotalOrders, ItemStats, DailyStats, CompleteOrderAnalytics };
