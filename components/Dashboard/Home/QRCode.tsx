"use client";

import Block from "@/components/Block";
import useUser from "@/hooks/queries/useUser";
import { Skeleton } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";
import { QRCode as QRCodeGen } from "react-qrcode-logo";
import { QRCodeConfig } from "@/app/dashboard/qrcode/page";
import { getQRCodeConfig, QRCodeDefault } from "@/utils/QRCode";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function QRCode() {
  const { company, isLoading } = useUser();
  const [qrConfig, setQrConfig] = useState<QRCodeConfig>();

  const menuUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_FRONTEND_URL}/menu/${company?.url}`,
    [company?.url]
  );

  useEffect(() => {
    const config = getQRCodeConfig();
    setQrConfig(config || QRCodeDefault);
  }, []);

  return !isLoading && company && qrConfig ? (
    <div className="">
      <Block className="h-80 flex flex-col items-center px-2">
        <div className="w-full max-w-[200px]  border-2 border-gray-300 rounded-md bg-gray-50 px-2 py-1 flex flex-row items-center gap-2 cursor-pointer">
          <Link
            href={menuUrl}
            target="_blank"
            className="truncate overflow-hidden whitespace-nowrap"
          >
            {menuUrl}
          </Link>
          <div className="min-w-5">
            <FiExternalLink />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <QRCodeGen
            value={menuUrl}
            ecLevel={qrConfig?.ecLevel}
            size={200}
            bgColor={qrConfig?.bgColor}
            fgColor={qrConfig?.fgColor}
            logoImage={qrConfig?.logoImage ? company.image.url : undefined}
            logoWidth={qrConfig?.logoWidth}
            logoOpacity={qrConfig?.logoOpacity}
            removeQrCodeBehindLogo={qrConfig?.removeQrCodeBehindLogo}
            logoPadding={qrConfig?.logoPadding}
            qrStyle={qrConfig?.qrStyle}
            eyeRadius={qrConfig?.eyeRadius}
            eyeColor={qrConfig?.eyeColor}
          />
          <Link
            className="text-gray-500 text-center hover:text-gray-400 transition-colors"
            href="/dashboard/qrcode"
          >
            Personalize seu QR Code
          </Link>
        </div>
      </Block>
    </div>
  ) : (
    <Skeleton className="h-80 w-68 rounded-xl" />
  );
}
