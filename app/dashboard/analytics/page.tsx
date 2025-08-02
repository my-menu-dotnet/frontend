"use client";

import { useState } from "react";
import { FaChartBar, FaShoppingCart, FaArrowUp } from "react-icons/fa";
import StatCard from "@/components/Dashboard/Analytics/StatCard";
import TopItemsChart from "@/components/Dashboard/Analytics/TopItemsChart";
import DailyOrdersChart from "@/components/Dashboard/Analytics/DailyOrdersChart";
import PeriodFilter from "@/components/Dashboard/Analytics/PeriodFilter";
import ItemsRankingTable from "@/components/Dashboard/Analytics/ItemsRankingTable";
import AnalyticsInsights from "@/components/Dashboard/Analytics/AnalyticsInsights";
import useCompleteAnalytics from "@/hooks/queries/analytics/useCompleteAnalytics";
import Block from "@/components/Block";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(1);

  // Use the complete analytics endpoint for better performance
  const { data: analytics, isLoading } = useCompleteAnalytics(selectedPeriod);

  // Calculate additional stats
  const topItem = analytics?.item_stats?.[0];
  const avgOrdersPerDay = analytics?.daily_stats?.length
    ? (
        analytics.daily_stats.reduce((sum, day) => sum + day.total_orders, 0) /
        analytics.daily_stats.length
      ).toFixed(1)
    : 0;

  return (
    <Block className="flex justify-center">
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics de Pedidos
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe o desempenho das vendas e itens mais populares
            </p>
          </div>
          <PeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total de Pedidos"
            value={analytics?.total_orders || 0}
            icon={<FaShoppingCart />}
            isLoading={isLoading}
          />

          <StatCard
            title="Item Mais Vendido"
            value={topItem?.item_title || "Nenhum"}
            icon={<FaArrowUp />}
            isLoading={isLoading}
          />

          <StatCard
            title="Vendas do Top Item"
            value={topItem?.total_ordered || 0}
            icon={<FaChartBar />}
            isLoading={isLoading}
          />

          <StatCard
            title="Média Diária"
            value={`${avgOrdersPerDay} pedidos`}
            icon={<FaChartBar />}
            isLoading={isLoading}
          />
        </div>

        {/* Charts and Insights */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopItemsChart
              data={analytics?.item_stats?.slice(0, 5) || []}
              isLoading={isLoading}
            />

            <DailyOrdersChart
              data={analytics?.daily_stats || []}
              isLoading={isLoading}
            />
            <AnalyticsInsights data={analytics} isLoading={isLoading} className="h-80" />
          </div>

          <ItemsRankingTable
            data={analytics?.item_stats || []}
            isLoading={isLoading}
          />
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Dica</h4>
            <p className="text-sm text-blue-800">
              Use os filtros de período para analisar tendências de diferentes
              intervalos de tempo.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-2">
              📈 Crescimento
            </h4>
            <p className="text-sm text-green-800">
              Itens populares podem indicar oportunidades para promoções ou
              expansão do cardápio.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="font-semibold text-purple-900 mb-2">⏰ Padrões</h4>
            <p className="text-sm text-purple-800">
              Analise os picos diários para otimizar horários de funcionamento e
              estoque.
            </p>
          </div>
        </div>
      </div>
    </Block>
  );
}
