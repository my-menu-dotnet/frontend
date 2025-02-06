import { FoodStatus } from "@/types/api/Food";
import Yup from "@/validators/Yup";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useRef } from "react";
import FoodForm, { FoodFormRef } from "./FoodForm";

export type FoodModalForm = {
  name: string;
  description: string;
  price?: number;
  image_id?: string;
  category_id: string;
  status: FoodStatus;
  lactose_free?: boolean;
  gluten_free?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  halal?: boolean;
};

const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.number().optional(),
  image_id: Yup.string().optional(),
  category_id: Yup.string().required(),
  status: Yup.string().required(),
  lactose_free: Yup.boolean().optional(),
  gluten_free: Yup.boolean().optional(),
  vegan: Yup.boolean().optional(),
  vegetarian: Yup.boolean().optional(),
  halal: Yup.boolean().optional(),
});

type FoodModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateModal({ open, onClose }: FoodModalProps) {
  const ref = useRef<FoodFormRef>(null);

  const handleClose = () => {
    ref.current?.reset();
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size="4xl">
      <ModalContent data-test="food-modal">
        <ModalHeader>Produto</ModalHeader>
        <ModalBody>
          <FoodForm ref={ref} onSuccess={handleClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
