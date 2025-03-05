"use client";

import Block from "@/components/Block";
import { useAuth } from "@/hooks/useAuth";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cooking from "@/assets/cooking.jpg";
import Logo from "@/assets/logo.svg";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";

export default function Page() {
  const { loginGoogle } = useAuth();
  const router = useRouter();

  const handleLoginGoogle = (response: CredentialResponse) => {
    loginGoogle.mutateAsync(response).then(() => {
      router.push("/dashboard");
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Block className="max-w-xl h-[450px] flex flex-col">
        <div className="w-full">
          <Link href="/">
            <FaChevronLeft />
          </Link>
        </div>
        <div className="flex-1 h-full flex flex-col justify-center items-center">
          <Image
            src={Logo}
            quality={100}
            width={80}
            height={80}
            priority
            alt="My Menu Logo"
            className="mb-6"
          />
          <div>
            <h1 className="text-center text-xl">Entrar</h1>
            <h2 className="text-gray-500 text-sm">
              Bem-vindo, para continuar, selecione uma das opções abaixo.
            </h2>

            <div className="mt-8 mb-12">
              <GoogleLogin onSuccess={handleLoginGoogle} />
            </div>
          </div>
        </div>

        <div className="">
          <p className="text-center text-gray-400 text-xs mt-6">
            Ao continuar, você concorda com os nossos Termos de Serviço e
            Política de Privacidade.
          </p>
        </div>
      </Block>
    </div>
  );
}
