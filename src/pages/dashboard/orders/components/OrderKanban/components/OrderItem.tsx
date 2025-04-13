import { useEffect, useState } from "react";
import { getLateStatus } from "../../../utils/getLateStatus";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Order } from "@/@types/api/order/Order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CiLocationOn } from "react-icons/ci";
import { currency } from "@/utils/text";

type ItemProps = {
  draggbleProvided: DraggableProvided;
  order: Order;
  onClick?: () => void;
};

type ItemStatus = "WARNING" | "DANGER";

export function OrderItem({ draggbleProvided, order, onClick }: ItemProps) {
  const [lateStatue, setLateStatus] = useState<ItemStatus>();

  const checkLateStatus = () => {
    setLateStatus(getLateStatus(order));
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
        <p>{order.user_name}</p>
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
          {order.address.neighborhood}, {order.address.street},{" "}
          {order.address.number}
        </p>
      </div>
      <div className="w-full flex justify-between">
        <p>#{String(order.order_number).padStart(3, "0")}</p>
        <p>{currency(order.total_price)}</p>
      </div>
    </div>
  );
}
