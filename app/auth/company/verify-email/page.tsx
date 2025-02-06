"use client";

import Image from "next/image";
import Logo from "@/assets/logo.svg";
import VerificationCode from "@/components/VerifyEmail/VerificationCode";
import useUser from "@/hooks/queries/useUser";

export default function Page() {
  const { data: user, isLoading } = useUser();

  if (isLoading || !user || !user.company) return null;

  return (
    <main className="absolute bg-gray-50 top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center">
      <div className="max-w-[700px] bg-white w-full flex flex-col rounded-xl shadow items-center gap-4 p-6">
        <Image src={Logo} alt="Logo" width={60} height={60} />
        <h1 className="text-xl font-semibold">
          Verifique o email da sua empresa.
        </h1>
        <p className="text-center">
          Enviamos um email para você verificar sua conta. Por favor, verifique
          seu email <span>{user.company.email}</span> e preencha o campo abaixo.
        </p>

        <VerificationCode type="COMPANY" />
      </div>
    </main>
  );
}
