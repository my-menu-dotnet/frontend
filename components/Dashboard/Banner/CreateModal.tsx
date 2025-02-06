import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import BannerForm, { BannerFormRef } from "./BannerForm";
import { useRef } from "react";
import useBanners from "@/hooks/queries/banner/useBanners";

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateModal({ open, onClose }: CreateModalProps) {
  const { refetch } = useBanners();
  const formRef = useRef<BannerFormRef>(null);

  const handleSuccess = () => {
    refetch().then(() => {
      formRef.current?.reset();
      onClose();
    });
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader>Adicionar Banner</ModalHeader>
        <ModalBody>
          <BannerForm ref={formRef} onSuccess={handleSuccess} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
