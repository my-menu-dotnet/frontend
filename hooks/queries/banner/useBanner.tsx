import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Banner } from "@/types/api/Banner";
import { useQuery } from "@tanstack/react-query";

const useBanner = (bannerId: string) =>
  useQuery<Banner>({
    queryKey: [QUERY_KEY.BANNER, bannerId],
    queryFn: async () => await fetchBanners(bannerId),
    retry: false,
  });

const fetchBanners = async (bannerId: string) => {
  try {
    const { data } = await api.get(`/banner/${bannerId}`);
    return data as Banner;
  } catch (error) {
    console.error(error);
    throw new Error("Banenrs not found");
  }
};

export default useBanner;
