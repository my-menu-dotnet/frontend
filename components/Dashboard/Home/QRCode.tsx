"use client";

import Block from "@/components/Block";
import useCompanyQrCode from "@/hooks/queries/useCompanyQrCode";
import useUser from "@/hooks/queries/useUser";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { useMemo } from "react";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";

export default function QRCode() {
  const { company, isLoading } = useUser();
  const { data: qrCode } = useCompanyQrCode();

  const menuUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_FRONTEND_URL}/menu/${company?.url}`,
    [company?.url]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl).then(() => {
      toast.success("Link copiado para a área de transferência");
    });
  };

  return !isLoading && company ? (
    <div className="">
      <Block className="h-80 flex flex-col items-center">
        <div
          className="border-[2px] border-gray-100 rounded-md bg-gray-50 px-2 py-1 flex flex-row items-center gap-2 cursor-pointer"
          onClick={handleCopy}
        >
          <p className="max-w-[200px] line-clamp-1">{menuUrl}</p>
          <FiCopy />
        </div>
        {qrCode && (
          <div>
            <Image
              src={qrCode}
              width={400}
              height={400}
              alt="QRCode"
              className="w-52 h-52"
            />
            <p className="text-center -mt-4 font-bold">{company.name}</p>
          </div>
        )}
      </Block>
    </div>
  ) : (
    <Skeleton className="h-80 w-68 rounded-xl" />
  );
}
