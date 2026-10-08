import Button from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCategory from "@/hooks/queries/useCategory";
import api from "@/services/api";
import { Category } from "@/types/api/Category";
import { useMutation } from "@tanstack/react-query";

type CategoryDeleteProps = {
  category: Category | null;
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
      if (!category) return null;
      return await api.delete(`/category/${category.id}`);
    },
  });

  const handleDelete = async () => {
    if (!category) return;
    await mutateAsync();
    await refetch();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apagar categoria</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja apagar a categoria{" "}
            <strong>{category?.name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onPress={onClose}
            text="Cancelar"
          />
          <Button
            data-test="button-modal-delete"
            color="danger"
            text="Apagar"
            onPress={handleDelete}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
