"use client";

import useCompany from "@/hooks/queries/useCompany";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "./Input";
import ImagePicker from "./ImagePicker";
import Button from "./Button";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import AddressForm from "./AddressForm";
import { AddressRequest } from "@/types/api/Address";
import { toast } from "react-toastify";
import Yup from "@/validators/Yup";
import FormItem from "./FormItem";
import ColorPicker from "./ColorPicker";

type CompanyForm = {
  name: string;
  cnpj?: string;
  primary_color: string;
  email: string;
  phone: string;
  image_id: string;
  address: AddressRequest;
};

const schema = Yup.object().shape({
  name: Yup.string().required(),
  cnpj: Yup.string(),
  primary_color: Yup.string()
    .required()
    .test("is-hex", "Cor primária inválida", (value) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
    ),
  email: Yup.string().email().required(),
  phone: Yup.string().required(),
  image_id: Yup.string().required(),
  address: Yup.object().address(),
});

export default function CompanyForm() {
  const router = useRouter();
  const { data: company } = useCompany();

  const { control, handleSubmit, setValue } = useForm<CompanyForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      cnpj: "",
      primary_color: "",
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

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-create-company"],
    mutationFn: async (data: CompanyForm) => {
      if (company?.id) {
        return await api.put(`/company/${company.id}`, data);
      }
      return await api.post("/company", data);
    },
    onError: (error) => {
      toast.error("Erro ao salvar empresa");
      console.error(error);
    },
    onSuccess: () => {
      if (!company?.id) {
        router.push("/auth/company/verify-email");
      }
      toast.success("Empresa salva com sucesso");
    },
  });

  const handleSubmitForm = async (data: CompanyForm) => {
    const newData = {
      ...data,
      cnpj: data.cnpj?.replace(/\D/g, ""),
      phone: data.phone.replace(/\D/g, ""),
      address: {
        ...data.address,
        zip_code: data.address.zip_code.replace(/\D/g, ""),
      },
    };
    mutate(newData);
  };

  useEffect(() => {
    if (company) {
      setValue("name", company.name || "");
      setValue("cnpj", company.cnpj || "");
      setValue("email", company.email || "");
      setValue("primary_color", company.primary_color || "");
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
      <FormItem
        title="Informações gerais"
        subtitle="Informações gerais sobre a sua empresa"
        first
      >
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
          <Controller
            name="primary_color"
            control={control}
            render={({ field, fieldState }) => (
              <ColorPicker
                label="Cor Primária"
                placeholder="Selecione a cor primária da sua empresa"
                description="O MyMenu funciona melhor com cores escuras, evite cores muito claras ;)"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>
      </FormItem>

      <FormItem
        title="Contato"
        subtitle='Seus dados de contato não são visiveis para usuários do tipo
            "convidado" dentro do aplicativo MyMenu. Porém, para
            usuarios autenticados e em seu link personalizado, esses dados são
            públicos.'
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                mask="phone"
                {...field}
              />
            )}
          />
        </div>
      </FormItem>

      <AddressForm control={control} />

      <FormItem
        title="Logo"
        subtitle="A logo da sua empresa é visível para todos os usuários do aplicativo
            MyMenu e será utilizada em diversos locais do aplicativo, favicon e
            icones tanto do menu quanto do app."
      >
        <ImagePicker
          fileStorage={company?.image}
          onFileChange={(file) => setValue("image_id", file.id)}
        />
      </FormItem>

      <div className="flex justify-end mt-4">
        <Button isLoading={isPending} type="submit" text="Enviar" />
      </div>
    </form>
  );
}
