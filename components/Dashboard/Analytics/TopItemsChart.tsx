"use client";

import Block from "@/components/Block";
import { ItemStats } from "@/types/api/analytics/OrderAnalytics";
import { Skeleton } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Importação dinâmica para evitar problemas de SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TopItemsChartProps = {
  data: ItemStats[];
  isLoading?: boolean;
  className?: string;
};

export default function TopItemsChart({
  data,
  isLoading = false,
  className = "",
}: TopItemsChartProps) {
  if (isLoading) {
    return (
      <Block className={`h-80 ${className}`}>
        <Skeleton className="h-6 w-1/2 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </Block>
    );
  }

  // Preparar dados para o ApexCharts
  const chartData = {
    series: [
      {
        name: "Pedidos",
        data: data.map((item) => item.total_ordered),
      },
    ],
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 250,
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    colors: ["#3b82f6"],
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: false,
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#374151"],
      },
      formatter: (val: number) => val.toString(),
      offsetX: 5,
    },
    xaxis: {
      categories: data.map((item) => {
        // Truncar nomes longos
        return item.item_title.length > 20 
          ? `${item.item_title.substring(0, 20)}...`
          : item.item_title;
      }),
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
          fontWeight: 500,
        },
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
          fontSize: "11px",
          fontWeight: 500,
        },
        maxWidth: 150,
      },
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
      y: {
        formatter: (value: number, { dataPointIndex }) => {
          const itemName = data[dataPointIndex]?.item_title || "";
          return `${value} pedidos - ${itemName}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 200,
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "center",
              },
            },
          },
        },
      },
    ],
  };

  return (
    <Block className={`h-80 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Itens Mais Vendidos
        </h3>
        <span className="text-sm text-gray-500">
          {data.length} {data.length === 1 ? "item" : "itens"}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500">
          <p>Nenhum dado disponível para o período selecionado</p>
        </div>
      ) : (
        <div className="h-60">
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="bar"
            height="100%"
          />
        </div>
      )}
    </Block>
  );
}
