"use client";

import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Menu } from "@/types/api/Menu";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type AnalyticsProps = {
  menu: Menu;
};

export default function Analytics({ menu }: AnalyticsProps) {
  const searchParams = useSearchParams();

  const { mutate } = useMutation({
    mutationFn: async () => {
      return api.post("/analytics/company/user-access", {
        company_id: menu.company.id,
        access_way: searchParams.get("access_way") || "WEB",
        accessed_at: new Date(),
      });
    },
    mutationKey: [QUERY_KEY.ANALYTICS_COMPANY_USER_ACCESS],
  });

  useEffect(() => {
    mutate();
  }, []);

  return <></>;
}
