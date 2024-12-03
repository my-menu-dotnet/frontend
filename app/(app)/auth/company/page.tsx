import CompanyForm from "@/components/CompanyForm";
import Image from "next/image";
import Logo from "@/assets/logo.svg";

export default function Page() {
  return (
    <main className="bg-gray-50 flex flex-col justify-center items-center">
      <div className="py-4 px-6 bg-white rounded-xl shadow flex flex-col items-center max-w-[1000px] my-4">
        <Image src={Logo} alt="Logo" width={80} height={80} />
        <div className="my-6">
          <h1 className="text-xl text-center font-semibold">
            Cadastre sua empresa
          </h1>
          <p className="text-center text-gray-400">
            Olá! É muito tê-lo por aqui 😊 Para começar a usar nossa plataforma
            e aproveitar todos os benefícios, precisamos de algumas informações
            sobre sua empresa. Preencha o formulário abaixo para continuar.
          </p>
        </div>
        <div className="mt-6">
          <CompanyForm />
        </div>
      </div>
    </main>
  );
}
