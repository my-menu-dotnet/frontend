"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputPassword from "@/components/InputPassword";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import Logo from "@/assets/logo.svg";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import RandomEmoji from "@/utils/randomEmoji";
import { useRouter } from "next/navigation";

type RegisterProps = {
  name: string;
  cpf: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
};

const schema = Yup.object().shape({
  name: Yup.string().fullName().required(),
  cpf: Yup.string().cpf().required(),
  email: Yup.string().email().required(),
  confirmEmail: Yup.string()
    .required()
    .oneOf([Yup.ref("email")], "Os emails não coincidem"),
  password: Yup.string().password().required(),
  confirmPassword: Yup.string()
    .password()
    .required()
    .oneOf([Yup.ref("password")], "As senhas não coincidem"),
});

export default function Page() {
  const router = useRouter();

  const { control, handleSubmit, setError } = useForm<RegisterProps>({
    resolver: yupResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: RegisterProps) => {
      return await api.post("/auth/register", data);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        toast("Ocorreu um erro ao registrar", {
          type: "error",
          icon: () => "😓",
        });
        return;
      }
      if (error.response?.status === 409) {
        setError("email", { message: " " });
        setError("cpf", { message: " " });

        const emoji = RandomEmoji.sad();

        toast("Email ou CPF já cadastrado", {
          type: "error",
          icon: () => emoji,
        });
        return;
      }
    },
    onSuccess: () => {
      router.push("/auth/verify-email");
    },
  });

  const handleRegister = (data: RegisterProps) => {
    const newData = {
      ...data,
      cpf: data.cpf.replace(/\D/g, ""),
    };
    mutate(newData);
  };

  return (
    <main className="flex flex-col items-center justify-center gap-12 w-full h-full">
      <div className="w-full flex flex-col justify-center items-center mt-4">
        <Image src={Logo} className="mb-8" alt="Logo" width={60} height={60} />
        <h1 className="text-2xl font-semibold">Bem vindo de volta</h1>
        <h2 className="text-gray-500">Faça login para continuar</h2>
      </div>
      <form
        className="flex flex-col flex-1 w-[80%] gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleRegister)();
        }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              size="lg"
              label="Nome"
              placeholder="Digite seu nome"
              isRequired
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="cpf"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              size="lg"
              label="CPF"
              placeholder="Digite seu CPF"
              isRequired
              mask="cpf"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              size="lg"
              label="Email"
              placeholder="Digite seu email"
              isRequired
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="confirmEmail"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              size="lg"
              label="Confirmar Email"
              placeholder="Confirme seu email"
              isRequired
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
              isRequired
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <InputPassword
              size="lg"
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              isRequired
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Button text="Registrar" isLoading={isPending} type="submit" />
      </form>

      <div className="absolute bottom-12">
        <a>
          Já tem uma conta?{" "}
          <span className="text-primary font-semibold">Entrar</span>
        </a>
      </div>
    </main>
  );
}
