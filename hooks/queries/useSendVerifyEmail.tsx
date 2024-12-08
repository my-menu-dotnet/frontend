import api from "@/services/api";
import { VerifyEmailType } from "@/types/api/auth/VerifyEmail";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useSendVerifyEmail = (type: VerifyEmailType) =>
  useQuery<null, AxiosError>({
    queryKey: ["verify-email-send", type],
    queryFn: async () => {
      return await fetchSendEmail(type);
    },
    retry: false,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

const fetchSendEmail = async (type: VerifyEmailType) => {
  await api.post<void>(`/auth/verify-email/send?type=${type}`);
  return null;
};

export default useSendVerifyEmail;
