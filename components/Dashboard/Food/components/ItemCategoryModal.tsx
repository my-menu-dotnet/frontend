import Button from "@/components/Button";
import Input from "@/components/Input";
import Switch from "@/components/Switch";
import Textarea from "@/components/Textarea";
import useFood from "@/hooks/queries/food/useFood";
import api from "@/services/api";
import { FoodItemCategory } from "@/types/api/food/FoodItemCategory";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type FoodItemCategoryForm = {
  title: string;
  description: string;
  required: boolean;
  min_items: number;
  max_items: number;
};

const schema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  required: Yup.boolean().required(),
  min_items: Yup.number().required(),
  max_items: Yup.number().required(),
});

type ItemCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  category?: FoodItemCategory;
  foodId: string;
};

export default function ItemCategoryModal({
  open,
  onClose,
  category,
  foodId,
}: ItemCategoryModalProps) {
  const { id } = useParams<{ id: string }>();
  const { refetch } = useFood(id);

  const { control, handleSubmit, setValue } = useForm<FoodItemCategoryForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: category?.title || "",
      description: category?.description || "",
      required: category?.required || false,
      min_items: category?.min_items || 0,
      max_items: category?.max_items || 0,
    },
  });

  const { mutate, isPending, reset } = useMutation({
    mutationFn: (data: FoodItemCategoryForm) =>
      category?.id
        ? api.put(`/food/${foodId}/category/${category.id}`, data)
        : api.post(`/food/${foodId}/category`, data),
    onSuccess: () => {
      refetch().then(() => {
        handleClose();
      });
    },
  });

  const handleItemCategory = (data: FoodItemCategoryForm) => {
    mutate(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    setValue("title", category?.title || "");
    setValue("description", category?.description || "");
    setValue("required", category?.required || false);
    setValue("min_items", category?.min_items || 0);
    setValue("max_items", category?.max_items || 0);
  }, [open, category, setValue]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleItemCategory)();
      }}
    >
      <Modal isOpen={open} onClose={handleClose} size="xl">
        <ModalContent>
          <ModalHeader>Adicionar categoria</ModalHeader>
          <ModalBody>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  placeholder="Digite o título"
                  label="Título"
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Textarea
                  placeholder="Digite a descrição"
                  label="Descrição"
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="min_items"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Digite a quantidade mínima"
                  label="Quantidade mínima"
                  value={field.value.toString()}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="max_items"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Digite a quantidade máxima"
                  label="Quantidade máxima"
                  value={field.value.toString()}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <Controller
              name="required"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange}>
                  {field.value ? "Obrigatório" : "Opcional"}
                </Switch>
              )}
            />
            <Button
              text="Adicionar"
              className="bg-primary text-white px-4 py-2 rounded-md"
              type="submit"
              onPress={() => handleSubmit(handleItemCategory)()}
              isLoading={isPending}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
}
