import Button from "@/components/Button";
import useCategory from "@/hooks/queries/useCategory";
import api from "@/services/api";
import { Category } from "@/types/api/Category";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

type CategoryDeleteProps = {
  category: Category;
  open: boolean;
  onClose: () => void;
};

export default function CategoryDelete({
  category,
  open,
  onClose,
}: CategoryDeleteProps) {
  const { refetch } = useCategory();

  const { mutateAsync } = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: async () => {
      return await api.delete(`/category/${category.id}`);
    },
  });

  const handleDelete = async () => {
    await mutateAsync();
    await refetch();
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Apagar categoria</ModalHeader>
            <ModalBody>
              <p>
                Tem certeza que deseja apagar a categoria{" "}
                <strong>{category.name}</strong>?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                text="Cancelar"
              />
              <Button
                data-test="button-modal-delete"
                color="danger"
                text="Enviar"
                onPress={handleDelete}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
