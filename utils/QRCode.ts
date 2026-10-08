export type QRCodeConfig = {
  ecLevel?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  logoImage?: boolean;
  logoWidth?: number;
  logoOpacity?: number;
  removeQrCodeBehindLogo?: boolean;
  logoPadding?: number;
  qrStyle?: "squares" | "dots";
  eyeRadius?: number;
  eyeColor?: string;
};

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
    return configString ? (JSON.parse(configString) as QRCodeConfig) : null;
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
