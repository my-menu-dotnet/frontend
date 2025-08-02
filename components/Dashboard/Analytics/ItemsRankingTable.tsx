"use client";

import Block from "@/components/Block";
import { ItemStats } from "@/types/api/analytics/OrderAnalytics";
import { Skeleton } from "@nextui-org/react";

type ItemsRankingTableProps = {
  data: ItemStats[];
  isLoading?: boolean;
  className?: string;
};

export default function ItemsRankingTable({
  data,
  isLoading = false,
  className = "",
}: ItemsRankingTableProps) {
  if (isLoading) {
    return (
      <Block className={`${className}`}>
        <Skeleton className="h-6 w-1/3 mb-6" />
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </Block>
    );
  }

  return (
    <Block className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Ranking Completo de Itens
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
        <div className="overflow-y-auto max-h-96">
          <table className="w-full">
            <thead className="sticky top-0 bg-white border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                  Posição
                </th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                  Item
                </th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">
                  Vendas
                </th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">
                  % do Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const totalSales = data.reduce((sum, i) => sum + i.total_ordered, 0);
                const percentage = ((item.total_ordered / totalSales) * 100).toFixed(1);

                return (
                  <tr
                    key={item.item_title}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900 truncate max-w-[200px]">
                        {item.item_title}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold text-gray-700">
                        {item.total_ordered}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-sm text-gray-600">
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Block>
  );
}
