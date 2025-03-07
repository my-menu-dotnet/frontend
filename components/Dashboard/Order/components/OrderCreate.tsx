import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { Address } from "@/types/api/Address";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GoPlus } from "react-icons/go";

type OrderCraeteForm = {
  userName: string;
  companyObservation: string;
  orderItems: OrderItemForm[];
  address: Partial<Address>;
};

const schema = Yup.object().shape({
  userName: Yup.string().required("Nome do cliente é obrigatório"),
  companyObservation: Yup.string(),
  orderItems: Yup.array().of(
    Yup.object().shape({
      productId: Yup.string().required("Produto é obrigatório"),
      quantity: Yup.number().required("Quantidade é obrigatória"),
    })
  ),
  address: Yup.object().shape({
    neighborhood: Yup.string().required("Bairro é obrigatório"),
    street: Yup.string().required("Rua é obrigatória"),
    number: Yup.string().required("Número é obrigatório"),
  }),
});

export default function OrderCreate() {
  const [isOpen, setIsOpen] = useState(false);

  const { control } = useForm<OrderCraeteForm>({
    resolver: yupResolver(schema),
  });

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button
        isIconOnly
        startContent={<GoPlus size={20} />}
        onPress={handleOpen}
        className="rounded-full"
        size="sm"
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h1>Novo Pedido</h1>
          </ModalHeader>
          <ModalBody>
            <Controller
              name="userName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Nome do cliente"
                  placeholder="Digite o nome do cliente"
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="companyObservation"
              control={control}
              render={({ field, fieldState }) => (
                <Textarea
                  label="Observação"
                  placeholder="Digite uma observação"
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
