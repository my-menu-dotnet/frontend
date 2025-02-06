import { QRCodeConfig } from "@/app/dashboard/qrcode/page";

export const saveQRCodeConfig = (config: QRCodeConfig) => {
  try {
    const configString = JSON.stringify(config);
    localStorage.setItem("qrCodeConfig", configString);
  } catch (error) {
    console.error("Error saving QR code config:", error);
  }
};

export const getQRCodeConfig = (): QRCodeConfig | null => {
  try {
    const configString = localStorage.getItem("qrCodeConfig");
    return configString ? JSON.parse(configString) : null;
  } catch (error) {
    console.error("Error retrieving QR code config:", error);
    return null;
  }
};

export const QRCodeDefault: QRCodeConfig = {
  ecLevel: "L",
  bgColor: "#FFFFFF",
  fgColor: "#000000",
  logoImage: true,
  logoWidth: 50,
  logoOpacity: 1,
  removeQrCodeBehindLogo: true,
  logoPadding: 0,
  qrStyle: "squares",
  eyeRadius: undefined,
  eyeColor: "#000000",
};