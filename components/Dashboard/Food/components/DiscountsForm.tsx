import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Switch from "@/components/Switch";
import useFood from "@/hooks/queries/food/useFood";
import useCategory from "@/hooks/queries/useCategory";
import useDiscount from "@/hooks/queries/useDiscount";
import useDiscounts from "@/hooks/queries/useDiscounts";
import api from "@/services/api";
import { DiscountsStatus, DiscountsType } from "@/types/api/Discounts";
import { Food } from "@/types/api/Food";
import { discountsStatusMasks } from "@/utils/lists";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
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
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type DiscountsFormForm = {
  food_id: string;
  discount: number;
  start_at?: string;
  end_at?: string;
  type: DiscountsType;
  active: boolean;
};

const schema = Yup.object().shape({
  food_id: Yup.string().required(),
  type: Yup.string().required(),
  discount: Yup.number()
    .required()
    .positive()
    .test("max", "O desconto deve ser menor que 100%", function (value) {
      if (this.parent.type === "PERCENTAGE") {
        return value <= 100;
      }
      return true;
    }),
  start_at: Yup.string().optional().nullable(),
  end_at: Yup.string().optional().nullable(),
  active: Yup.boolean().required(),
});

type DiscountsFormProps = {
  discountId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function DiscountsForm({
  discountId,
  open,
  onClose,
}: DiscountsFormProps) {
  const { id } = useParams<{ id: string }>();
  const { data: food, refetch } = useFood(id);
  const { data: discount } = useDiscount(discountId);

  const { control, setValue, getValues, setError, handleSubmit, reset } =
    useForm<DiscountsFormForm>({
      defaultValues: {
        active: true,
        food_id: food!.id,
      },
      resolver: yupResolver(schema),
    });

  const { mutateAsync, error } = useMutation({
    mutationKey: ["create-update-discounts"],
    mutationFn: async (data: DiscountsFormForm) => {
      if (discountId) {
        return await api.put(`/discount/${discountId}`, data);
      }
      return await api.post("/discount", data);
    },
    onSuccess: () => {
      handleClose();
      refetch();
    },
  });

  const handleSave = (data: DiscountsFormForm) => {
    if (data.type === "AMOUNT" && data.discount >= food!.price) {
      setError("discount", {
        type: "max",
        message:
          "O desconto não pode ser maior que o preço do produto selecionado",
      });
      return;
    }

    const res = mutateAsync(data);
    toast.promise(res, {
      pending: "Salvando desconto...",
      success: "Desconto salvo com sucesso",
    });

    res.catch((e) => {
      if (e.status === 409) {
        toast.error(
          "Já existe um desconto ativo no momento ou na validade selecionado"
        );
      }
    });
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  useEffect(() => {
    if (discount?.id === discountId && open) {
      setValue("food_id", discount.food.id);
      setValue("discount", discount.discount);
      setValue("type", discount.type);
      setValue("active", discount.active);
      setValue("start_at", discount.start_at);
      setValue("end_at", discount.end_at);
    }
  }, [discount, open]);

  console.log(getValues("active"));

  return (
    <>
      <Modal isOpen={!!open} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>Adicionar desconto</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
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
                    selectedKeys={[field.value]}
                    {...field}
                  >
                    <SelectItem isDisabled value="">
                      Selecione um tipo
                    </SelectItem>
                    <SelectItem key={"PERCENTAGE"} value="PERCENTAGE">
                      Porcentagem
                    </SelectItem>
                    <SelectItem key={"AMOUNT"} value="AMOUNT">
                      Valor
                    </SelectItem>
                  </Select>
                )}
              />

              {/* <I18nProvider locale="pt-BR">
                <DateRangePicker
                  label="Validade"
                  onChange={(range) => {
                    // @ts-expect-error - Know issue from nextui https://github.com/heroui-inc/next-app-template/issues/35
                    setValue("start_at", range?.start.toString());
                    // @ts-expect-error - Know issue from nextui https://github.com/heroui-inc/next-app-template/issues/35
                    setValue("end_at", range?.end.toString());
                  }}
                  // @ts-expect-error - Know issue from nextui https://github.com/heroui-inc/next-app-template/issues/35
                  value={
                    end && start
                      ? {
                          end: parseDate(end || ""),
                          start: parseDate(start || ""),
                        }
                      : undefined
                  }
                  minValue={today(getLocalTimeZone())}
                  visibleMonths={2}
                />
              </I18nProvider> */}
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <Controller
              control={control}
              name="active"
              render={({ field }) => <Switch.Active {...field} />}
            />
            <div>
              <Button color="default" variant="light" onPress={handleClose}>
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
