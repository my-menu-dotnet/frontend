import Block from "@/components/Block";
import useUser from "@/hooks/queries/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { QRCode as QRCodeGen } from "react-qrcode-logo";
import { getQRCodeConfig, QRCodeConfig, QRCodeDefault } from "@/utils/QRCode";
import { FiExternalLink } from "react-icons/fi";

export default function QRCode() {
  const { company, isLoading } = useUser();
  const [qrConfig, setQrConfig] = useState<QRCodeConfig>();

  const menuUrl = useMemo(
    () => `${import.meta.env.VITE_FRONTEND_URL}/menu/${company?.url}?access_way=QR_CODE`,
    [company?.url]
  );

  useEffect(() => {
    const config = getQRCodeConfig();
    setQrConfig(config || QRCodeDefault);
  }, []);

  return !isLoading && company && qrConfig ? (
    <div className="">
      <Block className="h-80 flex flex-col items-center px-2">
        <a
          href={menuUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full max-w-[200px] border-2 border-muted rounded-md bg-muted px-2 py-1 flex flex-row items-center gap-2 cursor-pointer"
        >
          <span className="truncate overflow-hidden whitespace-nowrap">
            {menuUrl}
          </span>
          <div className="min-w-5">
            <FiExternalLink />
          </div>
        </a>
        <div className="flex flex-col items-center">
          <QRCodeGen
            value={menuUrl}
            ecLevel={qrConfig?.ecLevel}
            size={200}
            bgColor={qrConfig?.bgColor}
            fgColor={qrConfig?.fgColor}
            logoImage={qrConfig?.logoImage ? company.image : undefined}
            logoWidth={qrConfig?.logoWidth}
            logoOpacity={qrConfig?.logoOpacity}
            removeQrCodeBehindLogo={qrConfig?.removeQrCodeBehindLogo}
            logoPadding={qrConfig?.logoPadding}
            qrStyle={qrConfig?.qrStyle}
            eyeRadius={qrConfig?.eyeRadius}
            eyeColor={qrConfig?.eyeColor}
          />
          <a
            href="/dashboard/qrcode"
            className="text-muted-foreground text-center hover:text-muted transition-colors"
          >
            Personalize seu QR Code
          </a>
        </div>
      </Block>
    </div>
  ) : (
    <Skeleton className="h-80 w-68 rounded-xl" />
  );
}
