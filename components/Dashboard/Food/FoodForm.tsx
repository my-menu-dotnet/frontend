"use client";

import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Switch from "@/components/Switch";
import Textarea from "@/components/Textarea";
import useCategory from "@/hooks/queries/useCategory";
import useCategorySelect from "@/hooks/queries/useCategorySelect";
import api from "@/services/api";
import { Food, FoodStatus } from "@/types/api/Food";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Select, SelectItem } from "@nextui-org/react";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
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

const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.number().optional(),
  image_id: Yup.string().optional(),
  category_id: Yup.string().required(),
  status: Yup.string().required(),
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
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleFood)();
        }}
      >
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              label="Nome"
              data-test="input-name"
              placeholder="Nome do produto"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              label="Descrição"
              data-test="input-description"
              placeholder="Descrição do produto"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field, fieldState }) => (
            <Input
              label="Preço"
              data-test="input-price"
              placeholder="Preço do produto"
              errorMessage={fieldState.error?.message}
              type="number"
              value={field.value?.toString()}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">R$</span>
                </div>
              }
              onChange={(e) => {
                field.onChange(parseFloat(e.target.value));
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="category_id"
          render={({ field, fieldState }) => (
            <Select
              data-test="select-category"
              className="w-full"
              label="Categoria"
              placeholder="Selecione uma categoria"
              variant="bordered"
              classNames={{
                trigger: "border-1 rounded-lg",
                listboxWrapper: "border-1 rounded-lg",
              }}
              selectedKeys={[field.value]}
              isInvalid={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
              isLoading={!categories}
              {...field}
            >
              {categories! &&
                Object.keys(categories).map((key) => (
                  <SelectItem
                    data-test={`select-item-${categories[key]}`}
                    key={key}
                  >
                    {categories[key]}
                  </SelectItem>
                ))}
            </Select>
          )}
        />
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
        <div className="w-full flex justify-between">
          <Controller
            control={control}
            name="status"
            render={({ field }) => <Switch.Status {...field} />}
          />

          <div>
            <Button
              data-test="input-submit"
              text="Enviar"
              type="submit"
              isLoading={!!isLoadingFile || isLoadingFood}
            />
          </div>
        </div>
      </form>
    );
  }
);

FoodForm.displayName = "FoodForm";

export default FoodForm;
