import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FoodForm, { FoodFormRef } from "./FoodForm";

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateModal({ open, onClose }: CreateModalProps) {
  const ref = useRef<FoodFormRef>(null);

  const handleClose = () => {
    ref.current?.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="sm:max-w-2xl"
        data-test="food-modal"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
        </DialogHeader>
        <FoodForm ref={ref} onSuccess={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
