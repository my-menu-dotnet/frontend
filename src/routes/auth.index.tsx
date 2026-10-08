import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { FaChevronLeft } from "react-icons/fa";
import Block from "@/components/Block";
import { useAuth, type CredentialResponse } from "@/hooks/useAuth";
import { GOOGLE_CLIENT_ID } from "@/lib/google";
import Logo from "@/assets/logo.svg";

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
});

function AuthPage() {
  const { loginGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef<(response: CredentialResponse) => void>(() => {});

  const handleLoginGoogle = (response: CredentialResponse) => {
    loginGoogle.mutate(response);
  };

  useEffect(() => {
    callbackRef.current = handleLoginGoogle;
  }, [handleLoginGoogle]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const gis = window.google?.accounts?.id;
      if (!gis || !buttonRef.current) return;
      gis.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: CredentialResponse) =>
          callbackRef.current(response),
      });
      gis.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
      });
    };
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Block className="max-w-xl h-[450px] flex flex-col">
        <div className="w-full">
          <Link to="/">
            <FaChevronLeft />
          </Link>
        </div>
        <div className="flex-1 h-full flex flex-col justify-center items-center">
          <img
            src={Logo}
            width={80}
            height={80}
            alt="My Menu Logo"
            className="mb-6 select-none"
          />
          <div>
            <h1 className="text-center text-xl">Entrar</h1>
            <h2 className="text-gray-500 text-sm">
              Bem-vindo, para continuar, selecione uma das opções abaixo.
            </h2>
            <div className="mt-8">
              <div ref={buttonRef} />
              {loginGoogle.isError && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  Não foi possível entrar com o Google. Tente novamente.
                </p>
              )}
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
