import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Banner } from "@/types/api/Banner";
import { BannerFilter } from "@/types/models/banner/BannerFilter";
import { Page } from "@/types/Page";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useBanners = () => {
  const [filters, setFilters] = useState<BannerFilter>({
    page: 0,
  });

  const query = useQuery<Page<Banner>>({
    queryKey: [QUERY_KEY.BANNERS],
    queryFn: async () => await fetchBanners(filters),
    retry: false,
  });

  return {
    ...query,
    filters,
    setFilters,
  };
};

const fetchBanners = async (filter: BannerFilter) => {
  try {
    const { data } = await api.get(`/banner`, {
      params: filter,
    });
    return data as Page<Banner>;
  } catch (error) {
    console.error(error);
    throw new Error("Banenrs not found");
  }
};

export default useBanners;
