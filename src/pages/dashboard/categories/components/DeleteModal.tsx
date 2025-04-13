import { Button } from "@/components/_ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/Modal";
import useDeleteCategory from "@/hooks/mutation/category/useDeleteCategory";

type DeleteModalProps = {
  open: string | undefined;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteModal({ open, onOpenChange }: DeleteModalProps) {
  const { mutateAsync } = useDeleteCategory();

  const handleDelete = () => {
    mutateAsync({ id: open as string })
      .then(() => {
        onOpenChange(false);
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  return (
    <Modal open={!!open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Remover categoria</ModalHeader>
        <ModalBody>
          <p>Você tem certeza que deseja remover esta categoria?</p>
          <p>Essa ação não pode ser desfeita.</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="destructive"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleDelete()}
          >
            Remover
          </Button>
          <Button
            variant="secondary"
            className="ml-2"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
