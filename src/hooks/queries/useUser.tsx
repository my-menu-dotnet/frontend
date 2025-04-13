import { User } from "@/@types/api/User";
import api from "@/service/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type UseUserType = () => UseQueryResult<User | null, Error> & {
  company: User["company"] | undefined;
};

const useUser: UseUserType = () => {
  const query = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      return await fetchUser();
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return {
    ...query,
    company: query.data?.company,
  };
};

const fetchUser = async () => {
  const response = await api.get("/user");
  return response.data;
};

export default useUser;
