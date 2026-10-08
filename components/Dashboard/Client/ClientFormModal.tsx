import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUpdateCreateClient from "@/hooks/mutate/useUpdateCreateClient";
import { Client, ClientRequest } from "@/types/api/Client";
import { states } from "@/utils/lists";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type ClientFormModalProps = {
  isOpen: boolean;
  client?: Client;
  /** Pre-fills the name field when opening for a new client. */
  prefillName?: string;
  onClose: () => void;
  /** Called with the new client after a successful create (not on edit). */
  onCreated?: (client: Client) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").optional(),
  phone: Yup.string()
    .transform((v) => (v ? String(v).replace(/\D/g, "") : v))
    .test("phone-digits", "Telefone inválido", (v) => !v || v.length >= 10)
    .optional(),
  cpf: Yup.string()
    .transform((v) => (v ? String(v).replace(/\D/g, "") : v))
    .test("cpf-digits", "CPF inválido", (v) => !v || v.length === 11)
    .optional(),
  street: Yup.string().optional(),
  number: Yup.string().optional(),
  complement: Yup.string().optional(),
  neighborhood: Yup.string().optional(),
  city: Yup.string().optional(),
  state: Yup.string().optional(),
  zip_code: Yup.string()
    .transform((v) => (v ? String(v).replace(/\D/g, "") : v))
    .test("cep-digits", "CEP inválido", (v) => !v || v.length === 8)
    .optional(),
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

/** Strip non-digits from a masked value before sending to the API. */
const stripMask = (value?: string) =>
  value ? value.replace(/\D/g, "") : undefined;

export default function ClientFormModal({
  isOpen,
  client,
  prefillName,
  onClose,
  onCreated,
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
        name: client?.name ?? prefillName ?? "",
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
  }, [isOpen, client, prefillName, reset]);

  const onSubmit = async (data: ClientFormShape) => {
    const payload: ClientRequest = {
      name: data.name,
      email: data.email || undefined,
      phone: stripMask(data.phone),
      cpf: stripMask(data.cpf),
    };
    if (data.street || data.city || data.state || data.zip_code) {
      payload.address = {
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: stripMask(data.zip_code),
      };
    }

    try {
      const saved = await mutateAsync({ ...payload, id: client?.id });
      if (!client?.id) {
        onCreated?.(saved);
      }
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar cliente" : "Adicionar cliente"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
        >
          <div className="flex flex-col gap-3 p-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Nome"
                  placeholder="Nome completo"
                  required
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
                      placeholder="Selecione o estado"
                      errorMessage={fieldState.error?.message}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      data-test="client-select-state"
                    >
                      {states.map((s) => (
                        <SelectItem key={s.key} value={s.key}>
                          {s.label}
                        </SelectItem>
                      ))}
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
          </div>
          <DialogFooter>
            <Button
              text="Cancelar"
              type="button"
              color="default"
              variant="ghost"
              onClick={onClose}
              data-test="client-button-cancel"
            />
            <Button
              text={isEditing ? "Salvar" : "Adicionar"}
              type="submit"
              disabled={isPending}
              data-test="client-button-submit"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
