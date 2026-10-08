import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function PopupAlert() {
  const [open, setOpen] = useState(false);

  const dontShowAgain = () => {
    localStorage.setItem("order-dontShowAgain", "true");
  };

  useEffect(() => {
    const dontShowAgain = localStorage.getItem("order-dontShowAgain");
    if (dontShowAgain) return;

    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Visualizaçao de produção</DialogTitle>
          <DialogDescription>
            Essa visualização é apenas para{" "}
            <span className="font-bold">pedidos em andamento</span> e{" "}
            <span className="font-bold">concluídos no dia</span>. Para
            visualizar todos os pedidos, acesse a lista de pedidos.
          </DialogDescription>
        </DialogHeader>
        <Checkbox className="mt-4" onChange={dontShowAgain}>
          Não mostrar novamente
        </Checkbox>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
