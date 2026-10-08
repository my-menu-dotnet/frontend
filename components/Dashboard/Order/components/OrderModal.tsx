import Button from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { usePrint } from "@/hooks/usePrint";
import api from "@/services/api";
import { Order } from "@/types/api/order/Order";
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
    <Dialog open={!!order} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>
                Pedido #{String(order.order_number).padStart(3, "0")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <h2>Cliente</h2>
                <p>Nome: {order.user_name}</p>
                <p>Email: {order.user?.email}</p>
                <p>Tel.:{order.user?.phone}</p>
              </div>

              <Separator />

              <div>
                <h2>Endereço</h2>
                <p>
                  {order.address.neighborhood}, {order.address.street}
                  , {order.address.number}
                </p>
              </div>

              <Separator />

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
            </div>

            <DialogFooter>
              <div className="w-full flex justify-between items-center">
                <div>
                  {order.status === "ACCEPTED" ||
                    (order.status === "CREATED" && (
                      <Button
                        text="Remover"
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={handleDelete}
                      />
                    ))}
                </div>
                <div>
                  <Button
                    text="Imprimir"
                    className="bg-primary text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      print(order);
                    }}
                  >
                    <FaPrint />
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
