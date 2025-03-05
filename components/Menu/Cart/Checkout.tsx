"use client";

import Block from "@/components/Block";
import SimpleFoodItem from "@/components/SimpleFoodItem";
import { FoodOrder, useCart } from "@/hooks/useCart";
import { calcTotalPrice } from "@/utils/calcTotalPrice";
import { currency } from "@/utils/text";
import { Divider } from "@nextui-org/react";
import { MdPayment } from "react-icons/md";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import useMutationOrder from "@/hooks/mutate/useMutationOrder";
import { useEffect } from "react";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import Button from "@/components/Button";
import { FaWhatsapp } from "react-icons/fa";
// initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "");

export default function Checkout() {
  const { items } = useCart();
  const { mutateAsync } = useMutationOrder();

  const handleOrder = () => {
    mutateAsync({
      orderItemForm: createOrderItemForm(items),
      total: calcTotalPrice(items),
    }).then((order) => {
      const whatsapUrl = `https://web.whatsapp.com/send?phone=5561985501197&text=Olá, gostaria de fazer o pedido ${order?.order_number}`;
      window.open(whatsapUrl, "_blank");
    });
  };

  return (
    <Block>
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        <MdPayment size={24} className="fill-gray-400" />
        <h1 className="text-lg">Finalizar compra</h1>
      </div>

      {items.length > 0 &&
        items.map((item, index) => (
          <div key={index}>
            <SimpleFoodItem
              title={item.title}
              price={item.price}
              description={item.description}
              image={item.image}
              total={item.quantity}
              hasIncrease={false}
            />
            <div className="ml-8">
              {item.items.map((subItem) => (
                <div key={subItem.id}>
                  <SimpleFoodItem
                    title={subItem.title}
                    price={subItem.price}
                    description={subItem.description}
                    image={subItem.image}
                    total={subItem.quantity}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

      <Divider className="my-4" />

      <div>
        <h2 className="text-lg text-gray-400">Resumo do pedido</h2>
        <div className="flex justify-between items-center mt-2">
          <span>Total</span>
          <span>{currency(calcTotalPrice(items))}</span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          startContent={<FaWhatsapp size={20} />}
          className="w-full"
          text="Finalizar compra"
          onPress={handleOrder}
        />
        <p className="text-sm text-center text-gray-400 mt-2">
          Ao cliclar em &quot;Finalizar compra&quot; você receberá o número do
          pedido e será redirecionado para o WhatsApp para finalizar a compra.
        </p>
      </div>

      {/* {preference?.preference_id && (
        <Wallet
          initialization={{
            preferenceId: preference?.preference_id,
          }}
        />
      )} */}
    </Block>
  );
}

const createOrderItemForm = (items: FoodOrder[]): OrderItemForm[] => {
  const orderItemForm: OrderItemForm[] = items.map((item) => {
    return {
      item_id: item.itemId,
      quantity: item.quantity,
      items: item.items.map((subItem) => ({
        item_id: subItem.itemId,
        quantity: subItem.quantity,
      })),
    };
  });

  return orderItemForm;
};
