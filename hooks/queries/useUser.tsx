import api from "@/services/api";
import { User } from "@/types/api/User";
import { useQuery } from "@tanstack/react-query";

const useUser = () =>
  useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      return await fetchUser();
    },
    retry: false,
  });

const fetchUser = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

export default useUser;
