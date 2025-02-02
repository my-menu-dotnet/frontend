import Button from "@/components/Button";
import Input from "@/components/Input";
import useCategory from "@/hooks/queries/useCategory";
import api from "@/services/api";
import { Category, CategoryStatus } from "@/types/api/Category";
import { status } from "@/utils/lists";
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

type CategoryModalProps = {
  newCategory: Category | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type CategoryForm = {
  name: string;
  status: CategoryStatus;
};

const schema = Yup.object().shape({
  name: Yup.string().required(),
  status: Yup.string().required(),
});

const CategoryModal = ({ open, setOpen, newCategory }: CategoryModalProps) => {
  const { refetch } = useCategory();
  const { control, handleSubmit, setValue, reset } = useForm<CategoryForm>({
    resolver: yupResolver(schema),
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["update-create-category"],
    mutationFn: async (data: CategoryForm) => {
      if (newCategory?.id) {
        return api.put(`/category/${newCategory.id}`, data);
      }
      return api.post("/category", data);
    },
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
  });

  const handleCategory = async (data: CategoryForm) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      pending: "Salvando categoria...",
      success: "Categoria salva com sucesso!",
      error: "Erro ao salvar categoria",
    });
  };

  useEffect(() => {
    if (newCategory) {
      const { name, status } = newCategory;
      setValue("name", name);
      setValue("status", status);
    } else {
      reset();
    }
  }, [newCategory]);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(handleCategory)();
            }}
          >
            <ModalHeader>Category</ModalHeader>
            <ModalBody>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Input
                    data-test="input-name"
                    label="Nome"
                    placeholder="Nome da categoria"
                    errorMessage={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="status"
                render={({ field, fieldState }) => (
                  <Select
                    data-test="select-status"
                    className="w-full"
                    label="Status"
                    placeholder="Selecione um status"
                    variant="bordered"
                    classNames={{
                      trigger: "border-1 rounded-lg",
                      listboxWrapper: "border-1 rounded-lg",
                    }}
                    selectedKeys={[field.value]}
                    isInvalid={Boolean(fieldState.error)}
                    errorMessage={fieldState.error?.message}
                    {...field}
                  >
                    {status.map((s) => (
                      <SelectItem
                        data-test={`select-item-${s.key}`}
                        key={s.key}
                      >
                        {s.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                text="Cancelar"
              />
              <Button data-test="input-submit" text="Enviar" type="submit" />
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;
