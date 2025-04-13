import { Button } from "@/components/_ui/button";
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import Switch from "@/components/form/Switch";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/Modal";
import useMutateCategory from "@/hooks/mutation/category/useMutateCategory";
import useCategory from "@/hooks/queries/category/useCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateEditModalProps = {
  open: string | boolean;
  onOpenChange: (open: boolean) => void;
};

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function CreateEditModal({
  open,
  onOpenChange,
}: CreateEditModalProps) {
  const { data } = useCategory({ id: open as string });
  const { mutateAsync: mutateCategory } = useMutateCategory();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      active: true,
    },
  });

  const handleUpdateCreateCategory = (data: FormData) => {
    const id = typeof open === "string" ? open : undefined;
    mutateCategory({ id, data })
      .then(() => {
        onOpenChange(false);
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        active: data.active,
      });
    } else {
      form.reset({
        name: "",
        active: true,
      });
    }
  }, [data, form, open]);

  return (
    <Modal open={!!open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Categoria</ModalHeader>
        <Form onSubmit={(data) => handleUpdateCreateCategory(data)} {...form}>
          <ModalBody>
            <Form.Field
              name="name"
              render={({ field }) => (
                <Input {...field} label="Name" placeholder="Name" required />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-row items-center justify-between w-full">
              <Form.Field
                name="active"
                render={({ field }) => <Switch label="Ativo" {...field} />}
              />
              <div>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="ml-2">
                  Salvar
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
