"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputPassword from "@/components/InputPassword";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import api from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import Checkbox from "@/components/Checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginProps = {
  email: string;
  password: string;
};

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export default function Page() {
  const router = useRouter();

  const { control, handleSubmit, setError } = useForm<LoginProps>({
    resolver: yupResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginProps) => {
      return await api.post("/auth/login", data);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        setError("email", { message: "Credenciais inválidas" });
        setError("password", { message: "Credenciais inválidas" });
        toast("Erro ao fazer login", { type: "error", icon: () => "😓" });
        return;
      }
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleLogin = async (data: LoginProps) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full h-full">
      <div className="w-full mb-4 flex-1 flex flex-col justify-center items-center">
        <Image src={Logo} className="mb-8" alt="Logo" width={60} height={60} />
        <h1 className="text-2xl font-semibold">Bem vindo de volta</h1>
        <h2 className="text-gray-500">Faça login para continuar</h2>
      </div>
      <form
        className="flex flex-col flex-[2] w-[80%] gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleLogin)();
        }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              size="lg"
              label="Email"
              placeholder="Digite seu email"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <InputPassword
              size="lg"
              label="Password"
              placeholder="Digite sua senha"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <div className="flex justify-between">
          <Checkbox size="sm">Lembrar de mim</Checkbox>
          <a href="#" className="text-primary">
            Esqueceu sua senha?
          </a>
        </div>
        <Button text="Entrar" isLoading={isPending} type="submit" />
      </form>

      <p className="mb-8">
        Ainda não tem uma conta?{" "}
        <Link href={"/auth/register"}>
          <span className="text-primary font-semibold">Cadastre-se</span>
        </Link>
      </p>
    </div>
  );
}
