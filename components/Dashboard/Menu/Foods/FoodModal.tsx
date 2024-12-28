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
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FoodCategories from "./FoodCategories";

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

type FoodModalProps = {
  food: Food | null;
  category_id: string | null;
  open: boolean;
  onClose: () => void;
};

export default function FoodModal({
  food,
  category_id,
  open,
  onClose,
}: FoodModalProps) {
  const { refetch: refetchCategory } = useCategory();
  const { data: categories } = useCategorySelect();

  const { control, handleSubmit, setValue, reset } = useForm<FoodModalForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["update-create-product"],
    mutationFn: async (data: FoodModalForm) => {
      if (food?.id) {
        return api.put(`/food/${food.id}`, data);
      }
      return api.post("/food", data);
    },
    onSuccess: async () => {
      await refetchCategory();
      handleClose();
    },
  });

  const handleFood = async (data: FoodModalForm) => {
    const promise = mutateAsync(data);

    toast.promise(promise, {
      pending: "Salvando produto...",
      success: "Produto salvo com sucesso!",
      error: "Erro ao salvar produto",
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
      } = food;
      setValue("name", name);
      setValue("description", description);
      setValue("price", price);
      setValue("status", status || "ACTIVE");
      setValue("category_id", category_id || "");
      setValue("image_id", image.id);
      setValue("lactose_free", lactose_free);
      setValue("gluten_free", gluten_free);
      setValue("vegan", vegan);
      setValue("vegetarian", vegetarian);
      setValue("halal", halal);
    }
  }, [food]);

  return (
    <Modal isOpen={open} onClose={handleClose} size="4xl">
      <ModalContent>
        <ModalHeader>Produto</ModalHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(handleFood)();
          }}
        >
          <ModalBody>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  label="Nome"
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
                      <SelectItem key={key}>{categories[key]}</SelectItem>
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
          </ModalBody>
          <ModalFooter>
            <div className="w-full flex justify-between">
              <Controller
                control={control}
                name="status"
                render={({ field }) => <Switch.Status {...field} />}
              />

              <div>
                <Button
                  color="default"
                  variant="light"
                  onPress={handleClose}
                  text="Cancelar"
                  type="button"
                />
                <Button text="Enviar" type="submit" />
              </div>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
