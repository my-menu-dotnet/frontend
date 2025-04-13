import Card from "@/components/Card";
// import {
//   calcTotalDiscount,
//   calcTotalWithoutDiscount,
//   usePrint,
// } from "@/hooks/usePrint";
import { Order } from "@/@types/api/order/Order";
import { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa6";
import { currency } from "@/utils/text";
import { calcTotalDiscount, calcTotalWithoutDiscount } from "@/utils/discount";

type CurrentOrderProps = {
  order: Order;
};

export default function CurrentOrder({ order }: CurrentOrderProps) {
  // const { print } = usePrint();
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - new Date(order.created_at).getTime();

      const minutes = Math.floor(elapsed / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      setElapsedTime(`${formattedMinutes}:${formattedSeconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePrint = () => {
    // print(order);
  };

  return (
    <Card className="relative py-4 px-4">
      <div className="flex">
        <div className="flex-1">
          <div>
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

            <div className="flex justify-around mt-4">
              <div className="text-center">
                <p className="font-semibold">Subtotal:</p>
                {currency(calcTotalWithoutDiscount(order.order_items))}
              </div>
              <div className="text-center">
                <p className="font-semibold">Desconto:</p>
                {currency(calcTotalDiscount(order.order_items))}
              </div>
              <div className="text-center">
                <p className="font-semibold">Total:</p>
                {currency(order.total_price)}
              </div>
            </div>
          </div>
        </div>
        <div className={`pr-4`}>{elapsedTime}</div>
        <div className="border-l-2 border-dashed pl-4 text-sm max-w-[300px] w-full pb-2">
          <div className="flex flex-col h-full">
            <span>Nome: {order.user_name}</span>
            <span>Tel.: {order.user?.phone}</span>
            <span>Email: {order.user?.email}</span>
            <span>
              Endereço: {order.address.neighborhood},{" "}
              {order.address.street}, {order.address.number}
            </span>
          </div>
          <div className="w-full flex items-center gap-2 justify-end text-gray-400">
            <span className="cursor-pointer" onClick={handlePrint}>
              <FaPrint />
            </span>
            <span>#{String(order.order_number).padStart(3, "0")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
