import Button from "@/components/Button";
import { usePrint } from "@/hooks/usePrint";
import api from "@/services/api";
import { Order } from "@/types/api/order/Order";
import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { FaPrint } from "react-icons/fa";

export default function OrderModal({
  order,
  onClose,
}: {
  order?: Order;
  onClose: () => void;
}) {
  const { print } = usePrint();

  const { mutate } = useMutation({
    mutationFn: () => api.delete(`/order/${order?.id}`),
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    mutate();
  };

  return (
    <Modal isOpen={!!order} onClose={onClose} size="2xl">
      <ModalContent>
        {order && (
          <>
            <ModalHeader>
              Pedido #{String(order.order_number).padStart(3, "0")}
            </ModalHeader>
            <ModalBody>
              <div>
                <h2>Cliente</h2>
                <p>Nome: {order.user.name}</p>
                <p>Email: {order.user.email}</p>
                <p>Tel.:{order.user.phone}</p>
              </div>

              <Divider />

              <div>
                <h2>Endereço</h2>
                <p>
                  {order.user.address.neighborhood}, {order.user.address.street}
                  , {order.user.address.number}
                </p>
              </div>

              <Divider />

              <div>
                <h2>Itens</h2>
                {order.order_items.map((item) => (
                  <div key={item.id}>
                    <p>
                      <span className="font-semibold">{item.quantity}x</span>{" "}
                      {item.title}
                    </p>
                    <p>{item.observation}</p>
                    {item.order_items && (
                      <div className="ml-4">
                        {item.order_items.map((subItem) => (
                          <div key={subItem.id}>
                            <span>
                              <span className="font-semibold">
                                {subItem.quantity}x
                              </span>{" "}
                              {subItem.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="w-full flex justify-between items-center">
                <div>
                  {order.status === "ACCEPTED" ||
                    (order.status === "CREATED" && (
                      <Button
                        text="Remover"
                        className="bg-danger text-white px-4 py-2 rounded-md"
                        onPress={handleDelete}
                      />
                    ))}
                </div>
                <div>
                  <Button
                    text="Imprimir"
                    className="bg-primary text-white px-4 py-2 rounded-md"
                    onPress={() => {
                      print(order);
                    }}
                  >
                    <FaPrint />
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
