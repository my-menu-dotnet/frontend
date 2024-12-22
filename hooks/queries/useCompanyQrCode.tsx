import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const useCompanyQrCode = () =>
  useQuery<string | null>({
    queryKey: ["company-qr-code"],
    queryFn: () => fetchCompanyQrCode(),
    retry: false,
  });

const fetchCompanyQrCode = async () => {
  try {
    const res = await api.get("/company/qr-code", { responseType: "arraybuffer" });

    const blob = new Blob([res.data], { type: "image/png" });
    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error(error);
    throw new Error("Company QR code not found");
  }
};

export default useCompanyQrCode;
