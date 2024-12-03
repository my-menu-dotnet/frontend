"use client";

import useCompany from "@/hooks/queries/useCompany";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "./Input";
import { CiCircleInfo } from "react-icons/ci";
import ImagePicker from "./ImagePicker";
import Button from "./Button";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import AddressForm from "./AddressForm";
import { AddressRequest } from "@/types/api/Address";
import { toast } from "react-toastify";

type CompanyForm = {
  name: string;
  cnpj?: string;
  email: string;
  phone: string;
  image_id: string;
  address: AddressRequest;
};

const schema = Yup.object().shape({
  name: Yup.string().required(),
  cnpj: Yup.string(),
  email: Yup.string().email().required(),
  phone: Yup.string().required(),
  image_id: Yup.string().required(),
  address: Yup.object().address(),
});

export default function CompanyForm() {
  const router = useRouter();
  const { data: company } = useCompany();

  const { control, handleSubmit, setValue, getValues } = useForm<CompanyForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      image_id: "",
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

  const { mutate } = useMutation({
    mutationKey: ["update-create-company"],
    mutationFn: async (data: CompanyForm) => {
      if (company?.id) {
        return await api.put(`/company/${company.id}`, data);
      }
      return await api.post("/company", data);
    },
    onError: (error) => {
      toast("Erro ao salvar empresa", { type: "error", icon: () => "😓" });
    },
    onSuccess: () => {
      if (!company?.id) {
        router.push("/dashboard");
      }
    },
  });

  const handleSubmitForm = async (data: CompanyForm) => {
    mutate(data);
  };

  useEffect(() => {
    if (company) {
      setValue("name", company.name || "");
      setValue("cnpj", company.cnpj || "");
      setValue("email", company.email || "");
      setValue("phone", company.phone || "");
      setValue("image_id", company.image?.id || "");
      setValue("address.city", company.address?.city || "");
      setValue("address.complement", company.address?.complement || "");
      setValue("address.neighborhood", company.address?.neighborhood || "");
      setValue("address.number", company.address?.number || "");
      setValue("address.state", company.address?.state || "");
      setValue("address.street", company.address?.street || "");
      setValue("address.zip_code", company.address?.zip_code || "");
    }
  }, [company]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleSubmitForm)();
      }}
    >
      <h2 className="mb-2">Dados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              className="w-full"
              placeholder="Digite o nome da sua empresa"
              isRequired
              label="Nome"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="cnpj"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              className="w-full"
              placeholder="Digite o CNPJ da sua empresa"
              label="CNPJ"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </div>

      <hr className="my-4" />

      <h2>Contato</h2>
      <h3 className="mb-2 text-xs text-gray-400">
        <CiCircleInfo className="inline-block" /> Seus dados de contato não são
        visiveis para usuários do tipo &quot;convidado&quot; dentro do
        aplicativo MyMenu. Porém, para usuarios autenticados e em seu link
        personalizado, esses dados são públicos.
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              className="w-full"
              placeholder="Digite o melhor email de contato"
              isRequired
              label="Email"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              className="w-full"
              placeholder="Digite o melhor telefone de contato"
              isRequired
              label="Telefone"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </div>

      <hr className="my-4" />

      <AddressForm control={control} />

      <hr className="my-4" />

      <h2 className="mb-2">Logo</h2>
      <ImagePicker
        fileStorage={company?.image}
        onFileChange={(file) => setValue("image_id", file.id)}
      />

      {/* <h2 className="mb-2 mt-4">Header</h2>
      <ImagePicker
          fileStorage={company?.header}
          onFileChange={(file) => setValue("header_id", file.id)}
        /> */}

      <div className="flex justify-end mt-4">
        <Button type="submit" text="Enviar" />
      </div>
    </form>
  );
}
