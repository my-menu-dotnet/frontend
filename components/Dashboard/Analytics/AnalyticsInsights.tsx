"use client";

import Block from "@/components/Block";
import { CompleteOrderAnalytics } from "@/types/api/analytics/OrderAnalytics";
import { Skeleton } from "@nextui-org/react";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

type AnalyticsInsightsProps = {
  data: CompleteOrderAnalytics | undefined;
  isLoading?: boolean;
  className?: string;
};

export default function AnalyticsInsights({
  data,
  isLoading = false,
  className = "",
}: AnalyticsInsightsProps) {
  if (isLoading || !data) {
    return (
      <Block className={`${className}`}>
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </Block>
    );
  }

  if (!data) {
    return (
      <Block className={className}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Insights Automáticos
        </h3>
        <p className="text-gray-500 text-center py-8">
          Carregue os dados para ver insights automáticos
        </p>
      </Block>
    );
  }

  const insights = [];

  // Calculate insights
  const totalSales = data.item_stats.reduce((sum, item) => sum + item.total_ordered, 0);
  const topItem = data.item_stats[0];
  const recentDays = data.daily_stats.slice(-7);
  const avgRecent = recentDays.reduce((sum, day) => sum + day.total_orders, 0) / recentDays.length;
  const olderDays = data.daily_stats.slice(-14, -7);
  const avgOlder = olderDays.length > 0 
    ? olderDays.reduce((sum, day) => sum + day.total_orders, 0) / olderDays.length 
    : avgRecent;

  // Top item insight
  if (topItem) {
    const percentage = ((topItem.total_ordered / totalSales) * 100).toFixed(1);
    insights.push({
      icon: <FiTrendingUp className="text-green-600" />,
      title: "Item Mais Popular",
      description: `${topItem.item_title} representa ${percentage}% de todas as vendas com ${topItem.total_ordered} pedidos.`,
      type: "success" as const,
    });
  }

  // Trend insight
  const trendDiff = ((avgRecent - avgOlder) / avgOlder) * 100;
  if (Math.abs(trendDiff) > 5) {
    const isGrowing = trendDiff > 0;
    insights.push({
      icon: isGrowing 
        ? <FiTrendingUp className="text-green-600" />
        : <FiTrendingDown className="text-red-600" />,
      title: isGrowing ? "Tendência de Crescimento" : "Queda nas Vendas",
      description: `Pedidos ${isGrowing ? "aumentaram" : "diminuíram"} ${Math.abs(trendDiff).toFixed(1)}% na última semana comparado à anterior.`,
      type: isGrowing ? "success" : "warning" as const,
    });
  } else {
    insights.push({
      icon: <FiMinus className="text-blue-600" />,
      title: "Vendas Estáveis",
      description: `As vendas mantiveram-se estáveis com média de ${avgRecent.toFixed(1)} pedidos por dia.`,
      type: "info" as const,
    });
  }

  // Performance insight
  const topItems = data.item_stats.slice(0, 3);
  const top3Sales = topItems.reduce((sum, item) => sum + item.total_ordered, 0);
  const top3Percentage = ((top3Sales / totalSales) * 100).toFixed(1);
  
  insights.push({
    icon: <FiTrendingUp className="text-purple-600" />,
    title: "Concentração de Vendas",
    description: `Os 3 itens mais vendidos representam ${top3Percentage}% do total de vendas. ${
      parseFloat(top3Percentage) > 60 
        ? "Considere promover outros itens." 
        : "Boa diversificação do cardápio."
    }`,
    type: parseFloat(top3Percentage) > 60 ? "warning" : "success" as const,
  });

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-yellow-500";
      case "info":
        return "border-l-blue-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <Block className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Insights Automáticos
      </h3>
      
      <div className="overflow-y-auto max-h-60 scrollbar-hide">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`mb-4 flex items-start gap-3 p-3 border-l-4 bg-gray-50 rounded-r-lg ${getInsightBorderColor(insight.type)}`}
          >
            <div className="mt-0.5">{insight.icon}</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {insight.title}
              </h4>
              <p className="text-sm text-gray-600">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Block>
  );
}
