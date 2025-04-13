import { Link } from "@tanstack/react-router";
import { FaChevronLeft } from "react-icons/fa";
import Logo from "@/assets/icons/logo.svg";
import Card from "@/components/Card";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const { loginGoogle } = useAuth();

  const handleGoogleLogin = async (response: CredentialResponse) => {
    loginGoogle.mutateAsync(response).then();
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="max-w-xl min-h-[450px] flex flex-col">
        <div className="w-full flex justify-start items-center">
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
            className="mb-6"
          />
          <div>
            <h1 className="text-center text-xl">Entrar</h1>
            <h2 className="text-gray-500 text-sm">
              Bem-vindo, para continuar, selecione uma das opções abaixo.
            </h2>

            <div className="mt-8 mb-12 flex w-100 items-center justify-center">
              <GoogleLogin onSuccess={handleGoogleLogin} />
            </div>
          </div>
        </div>

        <div className="">
          <p className="text-center text-gray-400 text-xs mt-6">
            Ao continuar, você concorda com os nossos Termos de Serviço e
            Política de Privacidade.
          </p>
        </div>
      </Card>
    </div>
  );
}
