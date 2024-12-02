import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useSendVerifyEmail = () =>
  useQuery({
    queryKey: ["verify-email-send"],
    queryFn: async () => {
      return await fetchSendEmail();
    },
    retry: false,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

const fetchSendEmail = async () => {
  return await api.post("/auth/verify-email/send");
};

export default useSendVerifyEmail;
