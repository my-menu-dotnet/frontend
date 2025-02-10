import Button from "@/components/Button";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import useFood from "@/hooks/queries/food/useFood";
import api from "@/services/api";
import { FoodItem } from "@/types/api/food/FoodItem";
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

type FoodItemForm = {
  title: string;
  description: string;
  price_increase: number | undefined;
  image_id: string;
};

const schema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  price_increase: Yup.number().optional().nullable(),
  image_id: Yup.string().required(),
});

type ItemModalProps = {
  open: boolean;
  onClose: () => void;
  item?: FoodItem;
  categoryId: string;
};

export default function ItemModal({
  open,
  onClose,
  item,
  categoryId,
}: ItemModalProps) {
  const { id } = useParams<{ id: string }>();
  const { refetch } = useFood(id);

  const { control, handleSubmit, setValue, watch } = useForm<FoodItemForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      price_increase: item?.price_increase,
    },
  });

  const { mutate, isPending, reset } = useMutation({
    mutationFn: (data: FoodItemForm) =>
      item?.id
        ? api.put(`/food/category/${categoryId}/item/${item.id}`, data)
        : api.post(`/food/category/${categoryId}/item`, data),
    onSuccess: () => {
      refetch().then(() => {
        handleClose();
      });
    },
  });

  const data = watch();

  console.log(data);

  const handleItemCategory = (data: FoodItemForm) => {
    mutate(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    setValue("title", item?.title || "");
    setValue("description", item?.description || "");
    setValue("price_increase", item?.price_increase || 0);
    setValue("image_id", item?.image?.id || "");
  }, [open, item, setValue]);

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
                  id="input-title"
                  placeholder="Título"
                  {...field}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Textarea
                  id="input-description"
                  placeholder="Descrição"
                  {...field}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="price_increase"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="input-price-increase"
                  placeholder="Aumento de preço"
                  type="number"
                  value={field.value ? field.value.toString() : ""}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : parseFloat(e.target.value)
                    );
                  }}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="image_id"
              control={control}
              render={({ field }) => (
                <ImagePicker
                  fileStorage={item?.image}
                  onFileChange={(file) => {
                    field.onChange(file.id);
                  }}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
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
