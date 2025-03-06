import useMutationOrderStatus from "@/hooks/mutate/useMutationOrderStatus";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import DroppableColumn from "./components/DroppableColumn";
import useOrdersKanban from "@/hooks/queries/order/useOrdersKanban";
import PopupAlert from "./components/PopupAlert";
import CurrentOrder from "./components/CurrentOrder";
import OrderModal from "../components/OrderModal";
import { Order } from "@/types/api/order/Order";
import { useNotificationOrder } from "@/hooks/useNotificationOrder";

export enum OrderStatus {
  CREATED = "CREATED",
  ACCEPTED = "ACCEPTED",
  PRODUCING = "PRODUCING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export default function OrderKanban() {
  const { data: orders, refetch: refetchOrderKanban } = useOrdersKanban();
  const [orderByStatus, setOrderByStatus] = useState<
    Record<OrderStatus, typeof orders>
  >({} as Record<OrderStatus, typeof orders>);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const { newOrder } = useNotificationOrder();

  const { mutate } = useMutationOrderStatus();

  const handleDragEnd = (dropResult: DropResult<string>) => {
    if (!dropResult.destination) {
      return;
    }

    const { source, destination, draggableId: orderId } = dropResult;
    const sourceStatus = source.droppableId as OrderStatus;
    const destinationStatus = destination.droppableId as OrderStatus;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    setOrderByStatus((prev) => {
      const orderToMove = prev[sourceStatus]?.find(
        (order) => order.id === orderId
      );
      if (!orderToMove) return prev;

      const newSourceItems = [...(prev[sourceStatus] || [])];
      const newDestItems =
        sourceStatus === destinationStatus
          ? newSourceItems
          : [...(prev[destinationStatus] || [])];

      newSourceItems.splice(sourceIndex, 1);

      if (sourceStatus === destinationStatus) {
        newSourceItems.splice(destinationIndex, 0, orderToMove);
      } else {
        newDestItems.splice(destinationIndex, 0, orderToMove);
      }

      newSourceItems.forEach((item, index) => {
        item.order = index + 1;
      });

      if (sourceStatus !== destinationStatus) {
        newDestItems.forEach((item, index) => {
          item.order = index + 1;
        });
      }

      mutate({
        status: destinationStatus,
        new_order: destinationIndex + 1,
        orderId,
      });

      return {
        ...prev,
        [sourceStatus]: newSourceItems,
        [destinationStatus]:
          sourceStatus === destinationStatus ? newSourceItems : newDestItems,
      };
    });
  };

  useEffect(() => {
    if (!orders) {
      return;
    }

    const orderByStatus = orders.reduce((acc, order) => {
      const status = order.status as OrderStatus;
      if (!acc[status]) {
        acc[status] = [];
      }

      acc[status].push(order);
      return acc;
    }, {} as Record<OrderStatus, typeof orders>);

    Object.keys(orderByStatus).forEach((status) => {
      const typedStatus = status as OrderStatus;
      if (orderByStatus[typedStatus]?.length) {
        orderByStatus[typedStatus].sort((a, b) => {
          const orderA =
            a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
          const orderB =
            b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        });
      }
    });

    setOrderByStatus(orderByStatus);
  }, [orders]);

  useEffect(() => {
    if (newOrder) {
      refetchOrderKanban();
    }
  }, [newOrder])

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        {orderByStatus[OrderStatus.PRODUCING] &&
          orderByStatus[OrderStatus.PRODUCING]?.length > 0 &&
          orderByStatus[OrderStatus.PRODUCING].map((order) => (
            <CurrentOrder key={`current-${order.id}`} order={order} />
          ))}
      </div>
      <OrderModal
        order={selectedOrder}
        onClose={() => {
          setSelectedOrder(undefined);
          refetchOrderKanban();
        }}
      />
      <PopupAlert />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="w-full flex justify-between gap-4 overflow-x-auto min-h-[800px]">
          <DroppableColumn
            data={orderByStatus[OrderStatus.CREATED] || []}
            droppeableId={OrderStatus.CREATED}
            title="Pedidos"
            headerColor="bg-blue-500"
            onClickOrder={(order) => setSelectedOrder(order)}
          />
          <DroppableColumn
            data={orderByStatus[OrderStatus.ACCEPTED] || []}
            droppeableId={OrderStatus.ACCEPTED}
            title="Aceitos"
            headerColor="bg-green-500"
            onClickOrder={(order) => setSelectedOrder(order)}
          />
          <DroppableColumn
            data={orderByStatus[OrderStatus.PRODUCING] || []}
            droppeableId={OrderStatus.PRODUCING}
            title="Em produção"
            headerColor="bg-yellow-500"
            onClickOrder={(order) => setSelectedOrder(order)}
          />
          <DroppableColumn
            data={orderByStatus[OrderStatus.READY] || []}
            droppeableId={OrderStatus.READY}
            title="Prontos"
            headerColor="bg-red-500"
            onClickOrder={(order) => setSelectedOrder(order)}
          />
          <DroppableColumn
            data={orderByStatus[OrderStatus.DELIVERED] || []}
            droppeableId={OrderStatus.DELIVERED}
            title="Entregues"
            headerColor="bg-purple-500"
            onClickOrder={(order) => setSelectedOrder(order)}
          />
        </div>
      </DragDropContext>
    </>
  );
}
