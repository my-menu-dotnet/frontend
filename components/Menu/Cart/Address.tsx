"use client";

import Block from "@/components/Block";
import useUser from "@/hooks/queries/useUser";
import { HiOutlineLocationMarker } from "react-icons/hi";
import FooterButtons from "./components/FooterButtons";
import { useCartStep } from "./hooks/useCarStep";
import { Controller, useForm } from "react-hook-form";
import Input from "@/components/Input";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import { states } from "@/utils/lists";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import useAddress from "@/hooks/queries/useAddress";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";

type AddressForm = {
  zip_code: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
};

const schema = Yup.object().shape({
  zip_code: Yup.string().required("CEP é obrigatório"),
  state: Yup.string().required("Estado é obrigatório"),
  city: Yup.string().required("Cidade é obrigatório"),
  neighborhood: Yup.string().required("Bairro é obrigatório"),
  street: Yup.string().required("Rua é obrigatório"),
  number: Yup.string().required("Número é obrigatório"),
});

export default function Address() {
  const { data: user, refetch: refetchUser } = useUser();
  const { addStep, removeStep } = useCartStep();
  const [cep, setCep] = useState<string | undefined>();
  const { data: address, isLoading: isLoadingAddress } = useAddress({
    cep: cep,
  });

  const { control, handleSubmit, setValue } = useForm<AddressForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      zip_code: address?.zip_code || user?.address?.zip_code || "",
      state: address?.state || user?.address?.state || "",
      city: address?.city || user?.address?.city || "",
      neighborhood: address?.neighborhood || user?.address?.neighborhood || "",
      street: address?.street || user?.address?.street || "",
      number: address?.number || user?.address?.number || "",
      complement: address?.complement || user?.address?.complement || "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: (address: AddressForm) => api.patch("/user", { address }),
    onSuccess: () => refetchUser().then(addStep),
  });

  const handleUpdateAddress = async (data: AddressForm) => {
    mutate({
      ...data,
      zip_code: data.zip_code.replace(/\D/g, ""),
    });
  };

  useEffect(() => {
    if (address) {
      const { zip_code, state, city, neighborhood, street } = address;
      setValue("zip_code", zip_code);
      setValue("state", state);
      setValue("city", city);
      setValue("neighborhood", neighborhood);
      setValue("street", street);
    }
  }, [address]);

  return (
    <>
      <Block>
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <HiOutlineLocationMarker size={24} className="text-gray-400" />
          <h1 className="text-lg">Preencha seu endereço</h1>
        </div>

        <p className="mt-6 text-gray-400">
          Preencha o formulário abaixo com o seu{" "}
          <span className="font-semibold">endereço de entrega</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
          <Controller
            name="zip_code"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite o CEP"
                isRequired
                label="CEP"
                errorMessage={fieldState.error?.message}
                mask="cep"
                endContent={
                  isLoadingAddress && (
                    <div>
                      <Spinner size="sm" />
                    </div>
                  )
                }
                {...field}
                onBlur={(e) => {
                  if (e.target.value.length === 9) {
                    setCep(e.target.value.replace(/\D/g, ""));
                  }
                }}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                placeholder="Selecione o estado"
                isRequired
                label="Estado"
                errorMessage={fieldState.error?.message}
                isInvalid={Boolean(fieldState.error)}
                selectedKeys={[field.value]}
                isDisabled={isLoadingAddress}
                {...field}
              >
                <>
                  <SelectItem value="" isDisabled>
                    Selecione o estado
                  </SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state.key} value={state.key}>
                      {state.label}
                    </SelectItem>
                  ))}
                </>
              </Select>
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite a cidade"
                isRequired
                label="Cidade"
                errorMessage={fieldState.error?.message}
                isDisabled={isLoadingAddress}
                {...field}
              />
            )}
          />
          <Controller
            name="neighborhood"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite o bairro"
                isRequired
                label="Bairro"
                errorMessage={fieldState.error?.message}
                isDisabled={isLoadingAddress}
                {...field}
              />
            )}
          />
          <Controller
            name="street"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite a rua"
                isRequired
                label="Rua"
                errorMessage={fieldState.error?.message}
                isDisabled={isLoadingAddress}
                {...field}
              />
            )}
          />
          <Controller
            name="number"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite o número"
                isRequired
                label="Número"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="complement"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite o complemento"
                label="Complemento"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>

        <FooterButtons
          onClickBack={removeStep}
          onClickNext={handleSubmit(handleUpdateAddress)}
        />
      </Block>
    </>
  );
}
