"use client";

import Image from "next/image";
import Logo from "@/assets/logo.svg";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useSendVerifyEmail from "@/hooks/queries/useSendVerifyEmail";
import Button from "@/components/Button";

type VerificationEmailProps = {
  code: string;
};

export default function Page() {
  return (
    <main className="absolute bg-gray-50 top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center">
      <div className="max-w-[700px] bg-white w-full flex flex-col rounded-xl shadow items-center gap-4 p-6">
        <Image src={Logo} alt="Logo" width={60} height={60} />
        <h1 className="text-xl font-semibold">Verifique seu email</h1>
        <p className="text-center">
          Enviamos um email para você verificar sua conta. Por favor, verifique
          seu email e preencha o campo abaixo.
        </p>

        <VerificationCode />
      </div>
    </main>
  );
}

function VerificationCode() {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const router = useRouter();
  const { error, refetch } = useSendVerifyEmail();

  useEffect(() => {
    if (!error) return;

    const axiosError = error as AxiosError;

    if (
      axiosError.response?.status === 400 &&
      // @ts-expect-error - Property 'message' does not exist on type 'unknown'
      axiosError.response?.data?.message === "Your account is already verified"
    ) {
      router.push("/dashboard");
    }

    if (
      axiosError.response?.status === 400 &&
      // @ts-expect-error - Property 'message' does not exist on type 'unknown'
      axiosError.response?.data?.message ===
        "Wait until 5 minutes to send other code"
    ) {
      toast("Espere 5 minutos para enviar outro código", {
        type: "error",
        icon: () => "😓",
      });
    }
  }, [error]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: async (data: VerificationEmailProps) => {
      return await api.post("/auth/verify-email", data);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        toast("Ocorreu um erro ao verificar seu email", {
          type: "error",
          icon: () => "😓",
        });
        return;
      }
      if (
        error.response?.status === 400 &&
        // @ts-expect-error - Property 'message' does not exist on type 'unknown'
        error.response?.data?.message === "Invalid email code"
      ) {
        toast("Código inválido", {
          type: "error",
          icon: () => "😓",
        });
      }
      if (error.response?.status === 410) {
        toast("Código expirado", {
          type: "error",
          icon: () => "😓",
        });
      }
    },
    onSuccess: () => {
      router.push("/auth/company");
    },
  });

  const nextInput = (index: number) => {
    if (inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const previousInput = (index: number) => {
    if (inputsRef.current[index - 1]) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const code = inputsRef.current.map((input) => input.value).join("");
    mutate({
      code,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row gap-2">
        {[...Array(6)].map((_, index) => (
          <VerificationInput
            key={index}
            nextInput={index === 5 ? handleSubmit : nextInput}
            previousInput={previousInput}
            inputsRef={inputsRef}
            index={index}
          />
        ))}
      </div>
      <Button
        text="Enviar"
        isLoading={isPending}
        onPress={() => handleSubmit()}
      />
      <div>
        <p>
          Não recebeu o email?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast("Código reenviado", { type: "success", icon: () => "📧" });
              refetch();
            }}
            className="text-primary"
          >
            Reenviar código
          </a>
        </p>
      </div>
    </div>
  );
}

type VerificationInputProps = {
  nextInput: (index: number) => void;
  previousInput: (index: number) => void;
  inputsRef: React.MutableRefObject<HTMLInputElement[]>;
  index: number;
};

function VerificationInput({
  nextInput,
  previousInput,
  inputsRef,
  index,
}: VerificationInputProps) {
  const [value, setValue] = useState("");

  return (
    <input
      ref={(el) => {
        if (el && !inputsRef.current.includes(el)) {
          inputsRef.current.push(el);
        }
      }}
      className="w-12 h-12 border border-gray-300 rounded-lg text-center outline-primary"
      type="text"
      onChange={(e) => {
        const value = e.target.value;
        setValue(value);

        if (value) {
          nextInput(index);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          if (!value) {
            previousInput(index);
          }
        }
      }}
      maxLength={1}
    />
  );
}
