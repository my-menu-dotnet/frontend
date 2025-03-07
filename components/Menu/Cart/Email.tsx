"use client";

import Block from "@/components/Block";
import FooterButtons from "./components/FooterButtons";
import Input from "@/components/Input";
import { useCartStep } from "./hooks/useCarStep";
import { MdOutlineEmail } from "react-icons/md";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InputOtp } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "@/validators/Yup";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import useUser from "@/hooks/queries/useUser";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";

export default function Email() {
  const { data: user } = useUser();
  const { loginGoogle, logout } = useAuth();
  const { addStep, removeStep } = useCartStep();

  const handleLoginGoogle = (response: CredentialResponse) => {
    loginGoogle.mutateAsync(response).then(addStep);
  };

  return (
    <Block>
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        <MdOutlineEmail size={24} className="fill-gray-400" />
        <h1 className="text-lg">Confirme seu email</h1>
      </div>

      {!user?.email ? (
        <div className="w-full h-72 flex flex-col justify-center items-center">
          <p className="text-center mb-8 text-gray-400 max-w-lg">
            Faça login para salvar seu endereço, acompanhar seus pedidos e
            receber ofertas exclusivas.
          </p>
          <GoogleLogin onSuccess={handleLoginGoogle} useOneTap auto_select />
          <p className="mt-2 text-center text-gray-400">Ou</p>
          <Button
            variant="light"
            color="default"
            className="text-gray-500"
            text="Continuar sem login"
            onPress={() => addStep()}
          />
        </div>
      ) : (
        <div className="h-72 flex flex-col justify-center items-center">
          <p className="text-center text-gray-400 max-w-2xl">
            Você já está logado como{" "}
            <span className="font-semibold">{user.name}</span>.
          </p>
          <p className="text-center text-gray-400 max-w-2xl">
            Não é você?{" "}
            <span
              className="text-primary font-semibold cursor-pointer"
              onClick={() => logout.mutateAsync()}
            >
              Sair
            </span>
            .
          </p>
        </div>
      )}

      <FooterButtons onClickNext={addStep} onClickBack={removeStep} hasNext={!!user} />
    </Block>
  );
}

type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
  next: () => void;
};

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
});

type EmailForm = {
  email: string;
};

const EmailInput = ({ setEmail, next }: EmailInputProps) => {
  const { removeStep } = useCartStep();

  const { mutate } = useMutation({
    mutationFn: (email: string) =>
      api.post("/auth/simplified/verify-email/send", { email }),
    onSuccess: next,
  });

  const { control, handleSubmit } = useForm<EmailForm>({
    resolver: yupResolver(schema),
  });

  const handleNext = (values: EmailForm) => {
    console.log(2134);
    setEmail(values.email);
    mutate(values.email);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex h-full flex-col gap-4 justify-center items-center">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              label="E-mail"
              className="max-w-2xl"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <p className="text-center text-sm text-gray-400 max-w-2xl">
          Para finalizar seu pedido, precisamos do seu email, mas não se
          preocupe, não enviaremos spam ou emails indesejados. 😉
        </p>
      </div>
      <FooterButtons
        onClickNext={handleSubmit(handleNext)}
        onClickBack={removeStep}
      />
    </div>
  );
};

type EmailCodeProps = {
  email: string;
  back: () => void;
};

const EmailCode = ({ email, back }: EmailCodeProps) => {
  const [code, setCode] = useState("");
  const { addStep } = useCartStep();

  const { mutate } = useMutation({
    mutationFn: (code: string) =>
      api.post("/auth/simplified/login", { email, code }),
    onSuccess: addStep,
  });

  const handleValidateEmail = () => {
    mutate(code);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <div className="text-center">
          <h2 className="text-lg">Código enviado</h2>
          <p className="text-center text-sm text-gray-400 max-w-2xl">
            Enviamos um código para o email{" "}
            <span className="font-semibold">{email}</span>.
          </p>
        </div>
        <InputOtp
          allowedKeys={"^[0-9A-Z]*$"}
          value={code}
          onValueChange={setCode}
          length={6}
          className="max-w-2xl"
        />
        <p className="text-center text-primary mt-2 cursor-pointer">
          Reenviar código
        </p>
      </div>

      <FooterButtons onClickBack={back} onClickNext={handleValidateEmail} />
    </div>
  );
};
