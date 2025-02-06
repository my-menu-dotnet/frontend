"use client";

import Image from "next/image";
import Logo from "@/assets/logo.svg";
import VerificationCode from "@/components/VerifyEmail/VerificationCode";
import useUser from "@/hooks/queries/useUser";
import { FiChevronLeft } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { logout } = useAuth();
  const { data: user, isLoading } = useUser();

  if (isLoading || !user) return null;

  return (
    <main className="h-full bg-gray-50 top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center">
      <div className="relative max-w-[700px] bg-white w-full flex flex-col rounded-xl shadow items-center gap-4 p-6">
        <div onClick={() => logout()} className="absolute top-4 left-4">
          <FiChevronLeft size={24} className="text-primary/70" />
        </div>
        <Image src={Logo} alt="Logo" width={60} height={60} />
        <h1 className="text-xl font-semibold">Verifique seu email</h1>
        <p className="text-center">
          Enviamos um email para você verificar sua conta. Por favor, verifique
          seu email <span>{user.email}</span> e preencha o campo abaixo.
        </p>

        <VerificationCode type="USER" />
      </div>
    </main>
  );
}
