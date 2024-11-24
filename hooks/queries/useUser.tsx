import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await fetchUser();
    },
    retry: false,
  });

const fetchUser = async () => {
  const response = await api.get("/user");
  return response.data;
};

export default useUser;
