import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
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

  return ( <></>
    // <Modal isOpen={open} onClose={() => setOpen(false)}>
    //   <ModalContent>
    //     <ModalHeader>Visualizaçao de produção</ModalHeader>
    //     <ModalBody>
    //       <p>
    //         Essa visualização é apenas para{" "}
    //         <span className="font-bold">pedidos em andamento</span> e{" "}
    //         <span className="font-bold">concluídos no dia</span>. Para
    //         visualizar todos os pedidos, acesse a lista de pedidos.
    //       </p>
    //       <Checkbox className="mt-4" onChange={dontShowAgain}>
    //         Não mostrar novamente
    //       </Checkbox>
    //     </ModalBody>
    //     <ModalFooter>
    //       <Button onPress={() => setOpen(false)}>Entendi</Button>
    //     </ModalFooter>
    //   </ModalContent>
    // </Modal>
  );
}
