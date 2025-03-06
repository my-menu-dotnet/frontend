"use client";

import Block from "@/components/Block";
import SimpleFoodItem from "@/components/SimpleFoodItem";
import { FoodOrder, useCart } from "@/hooks/useCart";
import {
  calcTotalDiscount,
  calcTotalPrice,
  calcTotalWithoutDiscount,
} from "@/utils/calcTotalPrice";
import { currency } from "@/utils/text";
import { Divider } from "@nextui-org/react";
import { MdPayment } from "react-icons/md";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import useMutationOrder from "@/hooks/mutate/useMutationOrder";
import { useEffect } from "react";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import Button from "@/components/Button";
import { FaWhatsapp } from "react-icons/fa";
import OrderOverview from "@/components/OrderOverview";
import { useMenuCompany } from "@/hooks/useMenuCompany";
// initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "");

export default function Checkout() {
  const { items } = useCart();
  const { company } = useMenuCompany();
  const { mutateAsync } = useMutationOrder();

  console.log(items)

  const handleOrder = () => {
    const orders = createOrderItemForm(items);
    
    console.log("items", items);
    console.log("orders", orders);

    mutateAsync({
      orderItemForm: orders,
      total: calcTotalPrice(items),
    }).then((order) => {
      const whatsapUrl = `https://wa.me/${getPhoneNumber(
        company.phone
      )}?text=Olá, gostaria de fazer o pedido ${order?.order_number}`;
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
              description={item.observation || ""}
              discount={item.discount}
              image={item.image}
              total={item.quantity}
              hasIncrease={false}
              hasChangeQuantity={false}
            />
            <div className="ml-8">
              {item.items.map((subItem) => (
                <div key={subItem.id}>
                  <SimpleFoodItem
                    title={subItem.title}
                    price={subItem.price}
                    description=""
                    image={subItem.image}
                    total={subItem.quantity}
                    hasChangeQuantity={false}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

      <Divider className="my-4" />

      <OrderOverview items={items} />

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
      observation: item.observation,
      discount_id: item.discount?.id,
      items: item.items.map((subItem) => ({
        item_id: subItem.itemId,
        quantity: subItem.quantity,
      })),
    };
  });

  return orderItemForm;
};

const getPhoneNumber = (number: string) => {
  return "55" + number.replace(/\D/g, "");
};
