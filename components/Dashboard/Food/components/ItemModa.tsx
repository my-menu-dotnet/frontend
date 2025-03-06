import Button from "@/components/Button";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Textarea from "@/components/Textarea";
import useFood from "@/hooks/queries/food/useFood";
import useInfiniteFood from "@/hooks/queries/food/useInfiniteFood";
import api from "@/services/api";
import { FileStorage } from "@/types/api/FileStorage";
import { Food } from "@/types/api/Food";
import { FoodItem } from "@/types/api/food/FoodItem";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { UIEventHandler, useEffect, useMemo, useState } from "react";
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
  const [currentImage, setCurrentImage] = useState<FileStorage | null>(
    item?.image || null
  );
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

  const { mutate: mutateDelete } = useMutation({
    mutationFn: () =>
      api.delete(`/food/category/${categoryId}/item/${item?.id}`),
    onSuccess: () => {
      refetch().then(() => {
        handleClose();
      });
    },
  });

  const handleItemCategory = (data: FoodItemForm) => {
    mutate(data);
  };

  const handleDelete = () => {
    mutateDelete();
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
          <ModalHeader>Item</ModalHeader>
          <ModalBody>
            <FoodSelect
              handleSelect={(food) => {
                setValue("title", food.name);
                setValue("description", food.description);
                setValue("image_id", food.image?.id || "");
                setCurrentImage(food.image || null);
              }}
            />
            <Divider />
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
                  fileStorage={currentImage || undefined}
                  onFileChange={(file) => {
                    field.onChange(file.id);
                  }}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-between items-center w-full">
              <Button
                text="Remover"
                className="bg-danger text-white px-4 py-2 rounded-md"
                onPress={handleDelete}
              />
              <Button
                text="Adicionar"
                className="bg-primary text-white px-4 py-2 rounded-md"
                type="submit"
                onPress={() => handleSubmit(handleItemCategory)()}
                isLoading={isPending}
              />
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
}

const FoodSelect = ({
  handleSelect,
}: {
  handleSelect: (food: Food) => void;
}) => {
  const [selected, setSelected] = useState<Food | null>(null);
  const { data: foods, fetchNextPage, isFetching } = useInfiniteFood();
  const foodsMap = useMemo<Food[]>(
    () => foods?.pages.flatMap((page) => page?.content) || [],
    [foods]
  );

  const handleScroll: UIEventHandler<HTMLSelectElement> = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight
    ) {
      fetchNextPage();
    }
  };

  const handleSelectCapture = (id: string) => {
    const food = foodsMap.find((food) => food.id === id);
    console.log(food);
    if (food) {
      setSelected(food);
      handleSelect(food);
    }
  };

  return (
    <Select
      data-test="select-food"
      className="w-full"
      label="Produto copiado"
      placeholder="Selecione um produto para copiar"
      variant="bordered"
      classNames={{
        trigger: "border-1 rounded-lg",
        listboxWrapper: "border-1 rounded-lg",
      }}
      selectedKeys={[selected?.id || ""]}
      onSelectionChange={(e) => {
        handleSelectCapture(Array.from(e as Set<string>)[0]);
      }}
      isLoading={isFetching}
      onScrollCapture={handleScroll}
    >
      {foodsMap?.map((food) => (
        <SelectItem key={food.id} value={food.id}>
          {food.name}
        </SelectItem>
      ))}
    </Select>
  );
};
