import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import useUpdateCreateClient from "@/hooks/mutate/useUpdateCreateClient";
import { Client, ClientRequest } from "@/types/api/Client";
import { states } from "@/utils/lists";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/Button";

type ClientFormModalProps = {
  isOpen: boolean;
  client?: Client;
  onClose: () => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").optional(),
  phone: Yup.string().optional(),
  cpf: Yup.string().optional(),
  street: Yup.string().optional(),
  number: Yup.string().optional(),
  complement: Yup.string().optional(),
  neighborhood: Yup.string().optional(),
  city: Yup.string().optional(),
  state: Yup.string().optional(),
  zip_code: Yup.string().optional(),
});

type ClientFormShape = {
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
};

const defaultValues: ClientFormShape = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zip_code: "",
};

export default function ClientFormModal({
  isOpen,
  client,
  onClose,
}: ClientFormModalProps) {
  const { mutateAsync, isPending } = useUpdateCreateClient();
  const isEditing = Boolean(client?.id);

  const { control, handleSubmit, reset } = useForm<ClientFormShape>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      const a = client?.address;
      reset({
        name: client?.name ?? "",
        email: client?.email ?? "",
        phone: client?.phone ?? "",
        cpf: client?.cpf ?? "",
        street: a?.street ?? "",
        number: a?.number ?? "",
        complement: a?.complement ?? "",
        neighborhood: a?.neighborhood ?? "",
        city: a?.city ?? "",
        state: a?.state ?? "",
        zip_code: a?.zip_code ?? "",
      });
    }
  }, [isOpen, client, reset]);

  const onSubmit = async (data: ClientFormShape) => {
    const payload: ClientRequest = {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      cpf: data.cpf || undefined,
    };
    if (data.street || data.city || data.state || data.zip_code) {
      payload.address = {
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
      };
    }

    try {
      await mutateAsync({ ...payload, id: client?.id });
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          {isEditing ? "Editar cliente" : "Adicionar cliente"}
        </ModalHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
        >
          <ModalBody className="gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Nome"
                  placeholder="Nome completo"
                  isRequired
                  errorMessage={fieldState.error?.message}
                  data-test="client-input-name"
                  {...field}
                />
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="E-mail"
                    placeholder="email@exemplo.com"
                    errorMessage={fieldState.error?.message}
                    data-test="client-input-email"
                    {...field}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    mask="phone"
                    errorMessage={fieldState.error?.message}
                    data-test="client-input-phone"
                    {...field}
                  />
                )}
              />
              <Controller
                name="cpf"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="CPF"
                    placeholder="000.000.000-00"
                    mask="cpf"
                    errorMessage={fieldState.error?.message}
                    data-test="client-input-cpf"
                    {...field}
                  />
                )}
              />
            </div>

            <div className="border-t pt-3 mt-2">
              <h3 className="text-sm font-semibold mb-2">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Controller
                  name="zip_code"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="CEP"
                      placeholder="00000-000"
                      mask="cep"
                      errorMessage={fieldState.error?.message}
                      data-test="client-input-zip"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="state"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Estado"
                      placeholder="Selecione o estado"
                      errorMessage={fieldState.error?.message}
                      selectedKeys={field.value ? [field.value] : []}
                      data-test="client-select-state"
                      {...field}
                    >
                      <>
                        <SelectItem value="" isDisabled>
                          Selecione o estado
                        </SelectItem>
                        {states.map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
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
                      label="Cidade"
                      placeholder="Cidade"
                      errorMessage={fieldState.error?.message}
                      data-test="client-input-city"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="neighborhood"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Bairro"
                      placeholder="Bairro"
                      errorMessage={fieldState.error?.message}
                      data-test="client-input-neighborhood"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="street"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Rua"
                      placeholder="Rua"
                      errorMessage={fieldState.error?.message}
                      data-test="client-input-street"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="number"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Número"
                      placeholder="Número"
                      errorMessage={fieldState.error?.message}
                      data-test="client-input-number"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="complement"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Complemento"
                      placeholder="Complemento"
                      errorMessage={fieldState.error?.message}
                      data-test="client-input-complement"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              text="Cancelar"
              type="button"
              color="default"
              variant="flat"
              onPress={onClose}
              data-test="client-button-cancel"
            />
            <Button
              text={isEditing ? "Salvar" : "Adicionar"}
              type="submit"
              isLoading={isPending}
              data-test="client-button-submit"
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
