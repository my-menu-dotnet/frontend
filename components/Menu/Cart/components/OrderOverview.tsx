import { FoodOrder } from "@/hooks/useCart";
import { OrderItem } from "@/types/api/order/OrderItem";
import {
  calcTotalDiscount,
  calcTotalPrice,
  calcTotalWithoutDiscount,
} from "@/utils/calcTotalPrice";
import { currency } from "@/utils/text";

type OrderOverviewProps = {
  items: FoodOrder[];
};

export default function OrderOverview({ items }: OrderOverviewProps) {
  return (
    <div>
      <h2 className="text-lg text-gray-400">Resumo do pedido</h2>
      <div className="flex justify-between items-center text-gray-500 mt-2">
        <span>Subtotal</span>
        <span>{currency(calcTotalWithoutDiscount(items))}</span>
      </div>
      <div className="flex justify-between items-center text-gray-500 mt-1">
        <span>Descontos</span>
        <span>- {currency(calcTotalDiscount(items))}</span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span>Total</span>
        <span data-test="order-total">{currency(calcTotalPrice(items))}</span>
      </div>
    </div>
  );
}
