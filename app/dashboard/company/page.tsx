"use client";

import Block from "@/components/Block";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import useCompany from "@/hooks/queries/useCompany";
import { AddressForm } from "@/types/api/Address";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CiCircleInfo } from "react-icons/ci";

type CompanyForm = {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  image_id: string;
  address: AddressForm;
};

const schema = Yup.object().shape({
  name: Yup.string().required(),
  cnpj: Yup.string().required(),
  email: Yup.string().email().required(),
  phone: Yup.string().required(),
  image_id: Yup.string().required(),
  address: Yup.object().shape({
    street: Yup.string().required(),
    number: Yup.string().required(),
    complement: Yup.string().optional(),
    neighborhood: Yup.string().required(),
    city: Yup.string().required(),
    state: Yup.string().required(),
    zip_code: Yup.string().required(),
  }),
});

export default function Page() {
  const { data: company } = useCompany();
  const { control, setValue } = useForm<CompanyForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (company) {
      setValue("name", company.name);
      setValue("cnpj", company.cnpj);
      setValue("email", company.email);
      setValue("phone", company.phone);
      setValue("image_id", company.image.id);
      setValue("address", company.address);
    }
  }, [company]);

  return (
    <main className="flex flex-col w-1/2">
      <h2 className="mb-2">Dados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Nome" {...field} />
          )}
        />
        <Controller
          name="cnpj"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="CNPJ" {...field} />
          )}
        />
      </div>

      <h2 className="mt-4">Contato</h2>
      <h3 className="mb-2 text-xs text-gray-400">
        <CiCircleInfo className="inline-block" /> Seus dados de contato não são
        visiveis para usuários do tipo "convidado" dentro do aplicativo MyMenu.
        Porém, em seu link personalizado, esses dados são públicos.
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Email" {...field} />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Telefone" {...field} />
          )}
        />
      </div>

      <h2 className="mt-4">Endereço</h2>
      <h3 className="mb-2 text-xs text-gray-400">
        <CiCircleInfo className="inline-block" /> O campo de endereço é
        obrigatório; no entanto, ele não é visível para usuários do tipo
        "convidado" no aplicativo MyMenu e pode ser ocultado tanto no app quanto
        no link personalizado.
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="address.street"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Rua" {...field} />
          )}
        />
        <Controller
          name="address.number"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Número" {...field} />
          )}
        />
        <Controller
          name="address.complement"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Complemento" {...field} />
          )}
        />
        <Controller
          name="address.neighborhood"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Bairro" {...field} />
          )}
        />
        <Controller
          name="address.city"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Cidade" {...field} />
          )}
        />
        <Controller
          name="address.state"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="Estado" {...field} />
          )}
        />
        <Controller
          name="address.zip_code"
          control={control}
          render={({ field }) => (
            <Input className="w-full" label="CEP" {...field} />
          )}
        />
      </div>

      <h2 className="mb-2 mt-4">Logo</h2>
      <ImagePicker
        fileStorage={company?.image}
        onFileChange={(file) => setValue("image_id", file.id)}
      />

      <h2 className="mb-2 mt-4">Header</h2>
      {/* <ImagePicker
          fileStorage={company?.header}
          onFileChange={(file) => setValue("header_id", file.id)}
        /> */}

      <div>

      </div>
    </main>
  );
}
