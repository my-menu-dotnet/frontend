import Block from "@/components/Block";
import { DailyStats } from "@/types/api/analytics/OrderAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { lazy, Suspense } from "react";
import { ApexOptions } from "apexcharts";

const Chart = lazy(() => import("react-apexcharts"));

type DailyOrdersChartProps = {
  data: DailyStats[];
  isLoading?: boolean;
  className?: string;
};

export default function DailyOrdersChart({
  data,
  isLoading = false,
  className = "",
}: DailyOrdersChartProps) {
  if (isLoading) {
    return (
      <Block className={`h-80 ${className}`}>
        <Skeleton className="h-6 w-1/2 mb-6" />
        <Skeleton className="h-48 w-full" />
      </Block>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const chartData = {
    series: [
      {
        name: "Pedidos",
        data: data.map((item) => ({
          x: formatDate(item.date),
          y: item.total_orders,
        })),
      },
    ],
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 250,
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    colors: ["#3b82f6"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 3,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    xaxis: {
      type: "category",
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontWeight: 500,
        },
        maxHeight: 50,
        rotate: -45,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontWeight: 500,
        },
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
      y: {
        formatter: (value: number) => `${value} pedidos`,
      },
    },
    markers: {
      size: 4,
      colors: ["#3b82f6"],
      strokeColors: "#ffffff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 200,
          },
          xaxis: {
            labels: {
              rotate: 0,
              maxHeight: 40,
            },
          },
        },
      },
    ],
  };

  const totalOrders = data.reduce((sum, item) => sum + item.total_orders, 0);

  return (
    <Block className={`h-80 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Pedidos Diários (Último Mês)
        </h3>
        <span className="text-sm text-muted-foreground">
          Total: {totalOrders} pedidos
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          <p>Nenhum dado disponível para o período</p>
        </div>
      ) : (
        <div className="h-60">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <Chart
              options={chartOptions}
              series={chartData.series}
              type="area"
              height="100%"
            />
          </Suspense>
        </div>
      )}
    </Block>
  );
}
