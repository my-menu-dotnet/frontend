import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Adicionar Banner</DialogTitle>
        </DialogHeader>
        <BannerForm ref={formRef} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
