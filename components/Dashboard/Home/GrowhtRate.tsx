"use client";

import useCompanyAccess from "@/hooks/queries/analytics/useCompanyAccess";
import { BsCalendar2Week } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { PiLightning } from "react-icons/pi";
import Block from "../../Block";
import { Skeleton } from "@nextui-org/react";

export function GrowthRate() {
  const { data: companyAccess, isLoading } = useCompanyAccess();

  const masks = {
    week: {
      title: "Essa semana",
      color: "bg-blue-500",
      icon: <PiLightning size={24} />,
    },
    month: {
      title: "Esse mês",
      color: "bg-green-500",
      icon: <BsCalendar2Week size={24} />,
    },
  } as {
    [key: string]: {
      title: string;
      color: string;
      icon: React.ReactNode;
    };
  };

  return (
    <div className="flex flex-row gap-4 mt-4">
      {!isLoading && companyAccess ? (
        Object.entries(companyAccess).map(([key, value]) => (
          <Block key={key} className="max-w-44 md:w-44">
            <div
              className={`flex justify-center items-center w-16 h-16 rounded-lg ${masks[key].color} text-white mb-6`}
            >
              {masks[key].icon}
            </div>
            <div className="flex flex-col justify-end gap-2">
              <p className="text-sm text-gray-400">{masks[key].title}</p>
              <div className="text-xl flex flex-row items-center gap-2">
                {value.total_access}
                {value.growth_percentage < 0 ? (
                  <FiChevronDown className="text-red-500" />
                ) : (
                  <FiChevronUp className="text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-400">
                {value.growth_percentage.toFixed(1)}%
              </p>
            </div>
          </Block>
        ))
      ) : (
        <>
          <Skeleton className="w-full h-[300px] max-w-44 md:w-44 rounded-xl" />
          <Skeleton className="w-full h-[300px] max-w-44 md:w-44 rounded-xl" />
        </>
      )}
    </div>
  );
}
