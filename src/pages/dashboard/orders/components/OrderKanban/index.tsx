// import useMutationOrderStatus from "@/hooks/mutate/useMutationOrderStatus";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import PopupAlert from "./components/PopupAlert";
import useOrders from "@/hooks/queries/order/useOrders";
import { Order, OrderStatus } from "@/@types/api/order/Order";
import { orderOrderByStatus } from "../../utils/orderOrderByStatus";
import DroppableColumn from "./components/DroppableColumn";
import { toLocalDate } from "@/utils/date";
import CurrentOrder from "./components/CurrentOrder";
// import { useNotificationOrder } from "@/hooks/useNotificationOrder";

type OrderByStatus = {
  [K in keyof OrderStatus]: Order[];
};

export default function OrderKanban() {
  const { data: pagedOrders } = useOrders({
    date: toLocalDate(new Date().toString()),
  });
  const [orderByStatus, setOrderByStatus] = useState<OrderByStatus>();

  // const handleDragEnd = (dropResult: DropResult<string>) => {};

  useEffect(() => {
    if (pagedOrders?.content) {
      setOrderByStatus(orderOrderByStatus(pagedOrders.content));
    }
  }, [pagedOrders]);

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        {orderByStatus?.["PRODUCING" as keyof OrderStatus] &&
          orderByStatus["PRODUCING" as keyof OrderStatus]?.length > 0 &&
          orderByStatus["PRODUCING" as keyof OrderStatus].map((order) => (
            <CurrentOrder key={`current-${order.id}`} order={order} />
          ))}
      </div>
      {/* <OrderModal
        order={selectedOrder}
        onClose={() => {
          setSelectedOrder(undefined);
          refetchOrderKanban();
        }}
      /> */}
      <DragDropContext onDragEnd={() => {}}>
        <div className="w-full flex justify-between gap-4 overflow-x-auto min-h-[800px]">
          {orderByStatus && (
            <>
              <DroppableColumn
                data={orderByStatus["CREATED" as keyof OrderStatus] || []}
                droppeableId={"CREATED"}
                title="Pedidos"
                headerColor="--color-blue-500"
                // onClickOrder={(order) => setSelectedOrder(order)}
              />
              <DroppableColumn
                data={orderByStatus["ACCEPTED" as keyof OrderStatus] || []}
                droppeableId={"ACCEPTED"}
                title="Aceitos"
                headerColor="--color-green-500"
                // onClickOrder={(order) => setSelectedOrder(order)}
              />
              <DroppableColumn
                data={orderByStatus["PRODUCING" as keyof OrderStatus] || []}
                droppeableId={"PRODUCING"}
                title="Em produção"
                headerColor="--color-yellow-500"
                // onClickOrder={(order) => setSelectedOrder(order)}
              />
              <DroppableColumn
                data={orderByStatus["READY" as keyof OrderStatus] || []}
                droppeableId={"READY"}
                title="Prontos"
                headerColor="--color-red-500"
                // onClickOrder={(order) => setSelectedOrder(order)}
              />
              <DroppableColumn
                data={orderByStatus["DELIVERED" as keyof OrderStatus] || []}
                droppeableId={"DELIVERED"}
                title="Entregues"
                headerColor="--color-purple-500"
                // onClickOrder={(order) => setSelectedOrder(order)}
              />
            </>
          )}
        </div>
      </DragDropContext>

      <PopupAlert />
    </>
  );
}
