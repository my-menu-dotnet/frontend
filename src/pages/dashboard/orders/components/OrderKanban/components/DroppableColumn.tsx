import { Order } from "@/@types/api/order/Order";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { HTMLAttributes } from "react";
import { OrderItem } from "./OrderItem";

type DroppableColumnProps = {
  droppeableId: string;
  title: string;
  data: Order[];
  headerColor: HTMLAttributes<HTMLDivElement>["className"];
  onClickOrder?: (order: Order) => void;
};

export default function DroppableColumn({
  droppeableId,
  title,
  data,
  headerColor,
  onClickOrder,
}: DroppableColumnProps) {
  return (
    <Droppable droppableId={droppeableId}>
      {(droppableProvided) => (
        <div
          className={`flex flex-col min-w-[200px] w-full ${headerColor} rounded-md`}
          style={{
            backgroundColor: `color-mix(in srgb, var(${headerColor}) 10%, white)`,
          }}
        >
          <div
            className={`text-white px-4 py-2 rounded-md mb-4`}
            style={{
              backgroundColor: `var(${headerColor})`,
            }}
          >
            <h1 className="text-lg font-bold">{title}</h1>
          </div>
          <div
            className="px-2 h-full"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {data.map((order, index) => (
              <Draggable key={order.id} draggableId={order.id} index={index}>
                {(draggbleProvided) => (
                  <OrderItem
                    draggbleProvided={draggbleProvided}
                    order={order}
                    onClick={() => onClickOrder && onClickOrder(order)}
                  />
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
