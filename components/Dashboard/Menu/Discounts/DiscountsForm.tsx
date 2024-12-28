import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Switch from "@/components/Switch";
import useCategory from "@/hooks/queries/useCategory";
import useDiscounts from "@/hooks/queries/useDiscounts";
import api from "@/services/api";
import { DiscountsStatus, DiscountsType } from "@/types/api/Discounts";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectSection,
} from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";

type DiscountsFormForm = {
  food_id: string;
  discount: number;
  start_at?: string;
  end_at?: string;
  type: DiscountsType;
  status: DiscountsStatus;
};

const schema = Yup.object().shape({
  food_id: Yup.string().required(),
  discount: Yup.number().required(),
  start_at: Yup.string().optional(),
  end_at: Yup.string().optional(),
  type: Yup.string().required(),
  status: Yup.string().required(),
});

type DiscountsFormProps = {
  formId?: string;
};

export default function DiscountsForm({ formId }: DiscountsFormProps) {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategory();
  const { refetch: refecthDiscounts } = useDiscounts();

  const { control, setValue, handleSubmit } = useForm<DiscountsFormForm>({
    defaultValues: {
      status: "ACTIVE",
    },
    resolver: yupResolver(schema),
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["create-update-discounts"],
    mutationFn: async (data: DiscountsFormForm) => {
      if (formId) {
        // update
      }
      return await api.post("/discount", data);
    },
    onSuccess: () => {
      setOpen(false);
      refecthDiscounts();
    },
  });

  const handleSave = (data: DiscountsFormForm) => {
    const res = mutateAsync(data);
    toast.promise(res, {
      pending: "Salvando desconto...",
      success: "Desconto salvo com sucesso",
      error: "Erro ao salvar desconto",
    });
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button
          onPress={() => setOpen(true)}
          startContent={<GoPlus size={24} />}
        >
          Adicionar
        </Button>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalContent>
          <ModalHeader>Adicionar desconto</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="food_id"
                render={({ field, fieldState }) => (
                  <Select
                    label="Produto"
                    placeholder="Selecione um produto"
                    isRequired
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                    {...field}
                  >
                    {categories?.map((category) => (
                      <SelectSection key={category.id} title={category.name}>
                        {category.foods.map((food) => (
                          <SelectItem key={food.id} value={food.id}>
                            {food.name}
                          </SelectItem>
                        ))}
                      </SelectSection>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="discount"
                render={({ field, fieldState }) => (
                  <Input
                    label="Desconto"
                    placeholder="Desconto"
                    isRequired
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value));
                    }}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="type"
                render={({ field, fieldState }) => (
                  <Select
                    label="Tipo"
                    placeholder="Selecione um tipo"
                    isRequired
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                    {...field}
                  >
                    <SelectItem isDisabled value="">
                      Selecione um tipo
                    </SelectItem>
                    <SelectItem key={"PERCENTAGE"} value="PERCENTAGE">
                      Porcentagem
                    </SelectItem>
                    <SelectItem key={"VALUE"} value="VALUE">
                      Valor
                    </SelectItem>
                  </Select>
                )}
              />
              <I18nProvider locale="pt-BR">
                <DateRangePicker
                  label="Validade"
                  onChange={(range) => {
                    setValue("start_at", range?.start.toString());
                    setValue("end_at", range?.end.toString());
                  }}
                  minValue={today(getLocalTimeZone())}
                  visibleMonths={2}
                />
              </I18nProvider>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <Controller
              control={control}
              name="status"
              render={({ field }) => <Switch.Status {...field} />}
            />
            <div>
              <Button
                color="default"
                variant="light"
                onPress={() => {
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onPress={() => handleSubmit(handleSave)()}>Salvar</Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
