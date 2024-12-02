"use client";

import AddressForm from "@/components/AddressForm";
import Input from "@/components/Input";
import useUser from "@/hooks/queries/useUser";
import { Address } from "@/types/api/Address";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type UserForm = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: Address;
};

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  cpf: Yup.string().required(),
  phone: Yup.string().required(),
  address: Yup.object().address(),
});

export default function Page() {
  const { data: user } = useUser();

  const { control, handleSubmit, setValue, getValues } = useForm<UserForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      phone: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zip_code: "",
      },
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("cpf", user.cpf);
      setValue("phone", user.phone);
      setValue("address", user.address);
    }
  }, [user]);

  return (
    <main>
      <h2>Seus dados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              className="w-full"
              label="Nome"
              placeholder="Digite seu nome"
              isRequired
              {...field}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              className="w-full"
              label="Email"
              placeholder="Digite seu email"
              isRequired
              {...field}
            />
          )}
        />
        <Controller
          name="cpf"
          control={control}
          render={({ field }) => (
            <Input
              className="w-full"
              label="CPF"
              placeholder="Digite seu CPF"
              isRequired
              {...field}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              className="w-full"
              label="Telefone"
              placeholder="Digite seu telefone"
              {...field}
            />
          )}
        />
      </div>

      <hr className="my-4" />

      <AddressForm control={control} />
    </main>
  );
}
