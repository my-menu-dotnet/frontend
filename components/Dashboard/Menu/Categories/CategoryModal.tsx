import Button from "@/components/Button";
import Input from "@/components/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import useCategory from "@/hooks/queries/useCategory";
import api from "@/services/api";
import { Category, CategoryStatus } from "@/types/api/Category";
import { status } from "@/utils/lists";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type EditTarget =
  | null
  | { mode: "new" }
  | { mode: "edit"; category: Category };

type CategoryModalProps = {
  target: EditTarget;
  onClose: () => void;
};

type CategoryForm = {
  name: string;
  status: CategoryStatus;
};

const schema: Yup.ObjectSchema<CategoryForm> = Yup.object().shape({
  name: Yup.string().required(),
  status: Yup.string<CategoryStatus>().oneOf(["ACTIVE", "INACTIVE"]).required(),
});

const CategoryModal = ({ target, onClose }: CategoryModalProps) => {
  const isOpen = target !== null;
  const editingCategory = target?.mode === "edit" ? target.category : null;
  const isEditing = editingCategory !== null;

  const { refetch } = useCategory();
  const { control, handleSubmit, setValue, reset } = useForm<CategoryForm>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", status: "ACTIVE" },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["update-create-category"],
    mutationFn: async (data: CategoryForm) => {
      if (isEditing) {
        return api.put(`/category/${editingCategory.id}`, data);
      }
      return api.post("/category", data);
    },
    onSuccess: async () => {
      await refetch();
      onClose();
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
    if (target?.mode === "edit") {
      setValue("name", target.category.name);
      setValue("status", target.category.status);
    } else if (target?.mode === "new") {
      reset({ name: "", status: "ACTIVE" });
    }
    // target changes drive the form re-init; reset is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(handleCategory)();
          }}
        >
          <FieldGroup>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="category-name">Nome</FieldLabel>
                  <Input
                    id="category-name"
                    data-test="input-name"
                    placeholder="Nome da categoria"
                    errorMessage={fieldState.error?.message}
                    {...field}
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={Boolean(fieldState.error)}
                  className="gap-2"
                >
                  <FieldLabel>Status</FieldLabel>
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    onValueChange={(v) => {
                      if (v) field.onChange(v);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {status.map((s) => (
                      <ToggleGroupItem
                        key={s.key}
                        value={s.key}
                        data-test={`select-item-${s.key}`}
                        className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        {s.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onPress={onClose}
              text="Cancelar"
              type="button"
            />
            <Button data-test="input-submit" text="Salvar" type="submit" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
