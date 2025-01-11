import { Controller } from "react-hook-form";
import { CiCircleInfo } from "react-icons/ci";
import Input from "./Input";
import Select from "./Select";
import SelectItem from "./SelectItem";
import { states } from "@/utils/lists";
import FormItem from "./FormItem";

type AddressFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
};

export default function AddressForm({ control }: AddressFormProps) {
  return (
    <>
      <FormItem
        title="Endereço"
        subtitle='O campo de endereço é obrigatório; no entanto, ele não é visível
            para usuários do tipo "convidado" no aplicativo MyMenu e
            pode ser ocultado tanto no app quanto no link personalizado.'
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="address.zip_code"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite o CEP"
                isRequired
                label="CEP"
                errorMessage={fieldState.error?.message}
                mask="cep"
                {...field}
              />
            )}
          />
          <Controller
            name="address.state"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                placeholder="Selecione o estado"
                isRequired
                label="Estado"
                errorMessage={fieldState.error?.message}
                isInvalid={Boolean(fieldState.error)}
                selectedKeys={[field.value]}
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
            name="address.city"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite a cidade"
                isRequired
                label="Cidade"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="address.neighborhood"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite o bairro"
                isRequired
                label="Bairro"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="address.street"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full"
                placeholder="Digite a rua"
                isRequired
                label="Rua"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="address.number"
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
            name="address.complement"
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
      </FormItem>
    </>
  );
}
