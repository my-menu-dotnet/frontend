import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Switch from "@/components/Switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useFood from "@/hooks/queries/food/useFood";
import api from "@/services/api";
import { DiscountsType } from "@/types/api/Discounts";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
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

const schema: Yup.ObjectSchema<DiscountsFormForm> = Yup.object().shape({
  food_id: Yup.string().required(),
  type: Yup.string<DiscountsType>().oneOf(["PERCENTAGE", "AMOUNT"]).required(),
  discount: Yup.number()
    .required()
    .positive()
    .test("max", "O desconto deve ser menor que 100%", function (value) {
      if (this.parent.type === "PERCENTAGE") {
        return value <= 100;
      }
      return true;
    }),
  start_at: Yup.string().optional(),
  end_at: Yup.string().optional(),
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
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: food, refetch } = useFood(id);

  const { control, setValue, setError, handleSubmit, reset } = useForm<DiscountsFormForm>({
    defaultValues: {
      active: true,
      food_id: food!.id,
    },
    resolver: yupResolver(schema),
  });

  const { mutateAsync } = useMutation({
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
    if (discountId && open) {
      // fetch discount to populate form, or use a query
    }
  }, [discountId, open]);

  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar desconto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 p-4">
          <Controller
            control={control}
            name="discount"
            render={({ field, fieldState }) => (
              <Input
                label="Desconto"
                placeholder="Desconto"
                required
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
                placeholder="Selecione um tipo"
                required
                errorMessage={fieldState.error?.message}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectItem value="PERCENTAGE">Porcentagem</SelectItem>
                <SelectItem value="AMOUNT">Valor</SelectItem>
              </Select>
            )}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <Controller
            control={control}
            name="active"
            render={({ field }) => <Switch.Active {...field} />}
          />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(handleSave)()}>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
