import { Order } from "@/types/api/order/Order";
import { currency } from "@/utils/text";
import { Draggable, DraggableProvided, Droppable } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { HTMLAttributes, useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { ptBR } from "date-fns/locale";

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
          className={`flex flex-col min-w-[150px] w-full ${headerColor} bg-opacity-10 rounded-md`}
        >
          <div
            className={`${headerColor} text-white px-4 py-2 rounded-md mb-4`}
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
                  <Item
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

type ItemProps = {
  draggbleProvided: DraggableProvided;
  order: Order;
  onClick?: () => void;
};

type ItemStatus = "WARNING" | "DANGER";

const Item = ({ draggbleProvided, order, onClick }: ItemProps) => {
  const [lateStatue, setLateStatus] = useState<ItemStatus>();

  const checkLateStatus = () => {
    if (order.status !== "READY" && order.status !== "DELIVERED") {
      const time = new Date().getTime() - new Date(order.created_at).getTime();
      if (time >= 1000 * 60 * 30) {
        setLateStatus("DANGER");
      } else if (time >= 1000 * 60 * 20) {
        setLateStatus("WARNING");
      } else {
        setLateStatus(undefined);
      }
    } else {
      setLateStatus(undefined);
    }
  };

  useEffect(() => {
    checkLateStatus();

    const intervalId = setInterval(() => checkLateStatus(), 1000 * 60 * 5);

    return () => clearInterval(intervalId);
  }, [order.status]);

  return (
    <div
      ref={draggbleProvided.innerRef}
      {...draggbleProvided.draggableProps}
      {...draggbleProvided.dragHandleProps}
      className={`bg-white ${
        lateStatue === "WARNING" && "border-t-yellow-500 border-t-4"
      } ${
        lateStatue === "DANGER" && "border-t-red-500 border-t-4"
      } px-4 py-2 rounded-md shadow-md mb-4 flex flex-col gap-2`}
      onClick={onClick}
    >
      <div className="w-full flex justify-between line-clamp-1">
        <p>{order.user.name}</p>
        <p
          className={`${lateStatue === "DANGER" && "text-red-500"} ${
            lateStatue === "WARNING" && "text-yellow-500"
          }`}
        >
          {(() => {
            const orderDate = new Date(order.created_at);
            const today = new Date();
            const orderDay = orderDate.getDate();
            const todayDay = today.getDate();
            const orderMonth = orderDate.getMonth();
            const todayMonth = today.getMonth();
            const orderYear = orderDate.getFullYear();
            const todayYear = today.getFullYear();

            if (
              orderDay === todayDay &&
              orderMonth === todayMonth &&
              orderYear === todayYear
            ) {
              return format(orderDate, "HH:mm");
            }

            if (
              orderDay === todayDay - 1 &&
              orderMonth === todayMonth &&
              orderYear === todayYear
            ) {
              return `Ontem ${format(orderDate, "HH:mm")}`;
            }

            const dayOfWeek = format(orderDate, "EEEE", { locale: ptBR });
            const dayOfWeekUpper =
              dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

            return `${dayOfWeekUpper} ${format(orderDate, "HH:mm")}`;
          })()}
        </p>
      </div>
      <div className="flex items-center gap-1 text-sm text-gray-400">
        <CiLocationOn size={18} />
        <p>
          {order.user.address.neighborhood}, {order.user.address.street},{" "}
          {order.user.address.number}
        </p>
      </div>
      <div className="w-full flex justify-between">
        <p>#{String(order.order_number).padStart(3, "0")}</p>
        <p>{currency(order.total_price)}</p>
      </div>
    </div>
  );
};
