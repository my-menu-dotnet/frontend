import Button from "@/components/Button";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Textarea from "@/components/Textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useFood from "@/hooks/queries/food/useFood";
import useInfiniteFood from "@/hooks/queries/food/useInfiniteFood";
import api from "@/services/api";
import { FileStorage } from "@/types/api/FileStorage";
import { Food } from "@/types/api/Food";
import { FoodItem } from "@/types/api/food/FoodItem";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { UIEventHandler, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type FoodItemForm = {
  title: string;
  description: string;
  price_increase?: number;
  image_id: string;
};

const schema: Yup.ObjectSchema<FoodItemForm> = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  price_increase: Yup.number().optional(),
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
  const { id } = useParams({ strict: false }) as { id: string };
  const { refetch } = useFood(id);

  const { control, handleSubmit, setValue } = useForm<FoodItemForm>({
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
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Item</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(handleItemCategory)();
          }}
        >
          <div className="flex flex-col gap-3 p-4">
            <FoodSelect
              handleSelect={(food) => {
                setValue("title", food.name);
                setValue("description", food.description);
                setValue("image_id", food.image?.id || "");
                setCurrentImage(food.image || null);
              }}
            />
            <Separator />
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
          </div>
          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <Button
                text="Remover"
                color="danger"
                onClick={handleDelete}
              />
              <Button
                text="Adicionar"
                type="submit"
                disabled={isPending}
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight
    ) {
      fetchNextPage();
    }
  };

  const handleSelectCapture = (id: string) => {
    const food = foodsMap.find((food) => food.id === id);
    if (food) {
      setSelected(food);
      handleSelect(food);
    }
  };

  return (
    <Select
      data-test="select-food"
      className="w-full"
      placeholder="Selecione um produto para copiar"
      value={selected?.id ?? ""}
      onValueChange={handleSelectCapture}
    >
      {foodsMap?.map((food) => (
        <SelectItem key={food.id} value={food.id}>
          {food.name}
        </SelectItem>
      ))}
    </Select>
  );
};
