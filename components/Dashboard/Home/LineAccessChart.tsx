"use client";

import useCompanyAccess from "@/hooks/queries/analytics/useCompanyAccess";
import { Line } from "react-chartjs-2";

import { Chart, registerables } from "chart.js";
import Block from "../../Block";
import { months } from "@/utils/lists";
import { Skeleton } from "@nextui-org/react";
Chart.register(...registerables);

export default function LineAccessChart() {
  const { data: companyAccess, isLoading } = useCompanyAccess();

  return (
    <>
      {!isLoading && companyAccess ? (
        <Block className="h-[300px]">
          <Line
            style={{ width: "100%", height: "100%" }}
            data={{
              labels: months,
              datasets: [
                {
                  label: "Acessos",
                  data: [0, 0, 0, 0, 12],
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              maintainAspectRatio: false,
            }}
          />
        </Block>
      ) : (
        <Skeleton className="w-full h-[300px] rounded-xl" />
      )}
    </>
  );
}
