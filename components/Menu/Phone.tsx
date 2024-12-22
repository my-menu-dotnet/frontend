"use client";

import { toast } from "react-toastify";
import { FiPhone } from "react-icons/fi";

type PhoneProps = {
  phone: string;
};

export default function Phone({ phone }: PhoneProps) {
  const handleCopy = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);

    if (isMobile) {
      window.open(`tel:${phone}`);
      return;
    }

    navigator.clipboard.writeText(phone);
    toast.success(`Telefone copiado para a área de transferência`);
  };

  return (
    <p className="text-sm cursor-pointer" onClick={() => handleCopy()}>
      <FiPhone size={22} />
    </p>
  );
}
