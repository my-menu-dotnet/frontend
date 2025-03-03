import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { Address } from "@/types/api/Address";
import { useQuery } from "@tanstack/react-query";

const useAddress = ({ cep }: { cep?: string }) =>
  useQuery<Address | null>({
    queryKey: [QUERY_KEY.ADDRESS, cep],
    queryFn: () => fetchAddress({ cep }),
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!cep,
  });

type fetchAddressProps = {
  cep?: string;
};

const fetchAddress = async (address: fetchAddressProps) => {
  try {
    const { data } = await api.get("/address", { params: address });
    return data as Address;
  } catch (error) {
    console.error(error);
    throw new Error("Address not found");
  }
};

export default useAddress;
