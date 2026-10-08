import Button from "@/components/Button";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import StatusToggle, { StatusValue } from "@/components/StatusToggle";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCategory from "@/hooks/queries/useCategory";
import useCategorySelect from "@/hooks/queries/useCategorySelect";
import api from "@/services/api";
import { Food, FoodStatus } from "@/types/api/Food";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import FoodCategories from "@/components/Dashboard/Menu/Foods/FoodCategories";
import QUERY_KEY from "@/constants/queryKey";
import { toast } from "react-toastify";

export type FoodModalForm = {
  name: string;
  description: string;
  price?: number;
  image_id?: string;
  category_id: string;
  status: FoodStatus;
  lactose_free?: boolean;
  gluten_free?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  halal?: boolean;
};

const schema: Yup.ObjectSchema<FoodModalForm> = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.number().optional(),
  image_id: Yup.string().optional(),
  category_id: Yup.string().required(),
  status: Yup.string<FoodStatus>().oneOf(["ACTIVE", "INACTIVE"]).required(),
  lactose_free: Yup.boolean().optional(),
  gluten_free: Yup.boolean().optional(),
  vegan: Yup.boolean().optional(),
  vegetarian: Yup.boolean().optional(),
  halal: Yup.boolean().optional(),
});

type FoodFormProps = {
  food?: Food;
  onSuccess?: () => void;
};

export type FoodFormRef = UseFormReturn<FoodModalForm>;

const FoodForm = forwardRef<FoodFormRef, FoodFormProps>(
  ({ food, onSuccess }: FoodFormProps, ref) => {
    const { refetch: refetchCategory } = useCategory();
    const { data: categories } = useCategorySelect();
    const isLoadingFile = useIsMutating({
      mutationKey: [QUERY_KEY.UPLOAD_FILE],
    });

    const form = useForm<FoodModalForm>({
      resolver: yupResolver(schema),
      defaultValues: {
        status: "ACTIVE",
      },
    });
    const { control, handleSubmit, setValue } = form;

    useImperativeHandle(ref, () => form);

    const { mutateAsync, isPending: isLoadingFood } = useMutation({
      mutationKey: [QUERY_KEY.UPDATE_CREATE_FOOD],
      mutationFn: async (data: FoodModalForm) =>
        food?.id ? api.put(`/food/${food.id}`, data) : api.post("/food", data),
      onSuccess: async () => {
        await refetchCategory();
        onSuccess?.();
      },
    });

    useEffect(() => {
      if (food?.id) {
        const {
          name,
          description,
          price,
          status,
          image,
          lactose_free,
          gluten_free,
          vegan,
          vegetarian,
          halal,
          category,
        } = food;
        setValue("name", name);
        setValue("description", description);
        setValue("price", price);
        setValue("status", status || "ACTIVE");
        setValue("category_id", category.id || "");
        setValue("image_id", image?.id);
        setValue("lactose_free", lactose_free);
        setValue("gluten_free", gluten_free);
        setValue("vegan", vegan);
        setValue("vegetarian", vegetarian);
        setValue("halal", halal);
      }
    }, [food]);

    const handleFood = async (data: FoodModalForm) => {
      const promise = mutateAsync(data);

      toast.promise(promise, {
        pending: "Salvando produto...",
        success: "Produto salvo com sucesso!",
        error: "Erro ao salvar produto",
      });
    };

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleFood)();
        }}
      >
        <FieldGroup className="gap-4 max-h-[60vh] overflow-y-auto pr-1">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={Boolean(fieldState.error)}>
                <FieldLabel htmlFor="food-name">Nome</FieldLabel>
                <Input
                  id="food-name"
                  data-test="input-name"
                  placeholder="Nome do produto"
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={Boolean(fieldState.error)}>
                <FieldLabel htmlFor="food-description">Descrição</FieldLabel>
                <Textarea
                  id="food-description"
                  data-test="input-description"
                  placeholder="Descrição do produto"
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              </Field>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="food-price">Preço</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <span className="text-muted-foreground text-sm">R$</span>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="food-price"
                      data-test="input-price"
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={
                        field.value === undefined || field.value === null
                          ? ""
                          : String(field.value)
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : parseFloat(v));
                      }}
                      aria-invalid={Boolean(fieldState.error)}
                    />
                  </InputGroup>
                  {fieldState.error?.message && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="category_id"
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="food-category">Categoria</FieldLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="food-category"
                      data-test="select-category"
                      className="w-full"
                      aria-invalid={Boolean(fieldState.error)}
                    >
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories &&
                        Object.keys(categories).map((key) => (
                          <SelectItem
                            data-test={`select-item-${categories[key]}`}
                            key={key}
                            value={key}
                          >
                            {categories[key]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error?.message && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            control={control}
            name="image_id"
            render={({ field }) => (
              <ImagePicker
                fileStorage={food?.image}
                onFileChange={(file) => {
                  field.onChange(file.id);
                }}
              />
            )}
          />
          <FoodCategories control={control} />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <StatusToggle
                value={field.value as StatusValue}
                onChange={(v) => field.onChange(v)}
              />
            )}
          />
        </FieldGroup>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Alterações são aplicadas ao salvar.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              data-test="input-submit"
              text="Salvar"
              type="submit"
              isLoading={!!isLoadingFile || isLoadingFood}
            />
          </div>
        </div>
      </form>
    );
  },
);

FoodForm.displayName = "FoodForm";

export default FoodForm;
