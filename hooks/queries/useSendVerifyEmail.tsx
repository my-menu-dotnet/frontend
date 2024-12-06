import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useSendVerifyEmail = () =>
  useQuery<null, AxiosError>({
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
  await api.post<void>("/auth/verify-email/send");
  return null;
};

export default useSendVerifyEmail;
