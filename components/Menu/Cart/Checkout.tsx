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
import { Divider, Input } from "@nextui-org/react";
import { MdPayment } from "react-icons/md";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import useMutationOrder from "@/hooks/mutate/useMutationOrder";
import { useEffect, useRef } from "react";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import Button from "@/components/Button";
import { FaWhatsapp } from "react-icons/fa";
import OrderOverview from "@/components/OrderOverview";
import { useMenuCompany } from "@/hooks/useMenuCompany";
import { useRouter } from "next/navigation";
import { useCartStep } from "./hooks/useCarStep";
import { useMutationOrderAnonymous } from "@/hooks/mutate/useMutationOrderAnonymous";
import useUser from "@/hooks/queries/useUser";
// initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "");

export default function Checkout() {
  const nameRef = useRef<HTMLInputElement>(null);
  const { items } = useCart();
  const { address } = useCartStep();
  const { data: user } = useUser();
  const { company } = useMenuCompany();
  const { mutateAsync } = useMutationOrder();
  const { mutateAsync: mutateAsyncAnon } = useMutationOrderAnonymous();
  const router = useRouter();

  const handleRedirect = (orderNumber: number) => {
    const pedido = String(orderNumber).padStart(3, "0");
    const whatsapUrl = `https://wa.me/${getPhoneNumber(
      company.phone
    )}?text=Olá, acabei de fazer o pedido ${pedido} pelo My Menu. Poderia me ajudar a finalizar a compra?`;
    setTimeout(() => {
      window.open(whatsapUrl, "_blank");
    });

    if (user) {
      return router.push(`/menu/${company.url}/profile`);
    }
    router.push(`/menu/${company.url}`);
  };

  const handleOrder = () => {
    const orders = createOrderItemForm(items);

    if (!user) {
      mutateAsyncAnon({
        order_items: orders,
        address: address!,
        user_name: nameRef.current?.value || "",
        company_observation: "",
      }).then((order) => handleRedirect(order.order_number));
      return;
    }

    mutateAsync({
      orderItemForm: orders,
      total: calcTotalPrice(items),
    }).then((order) => handleRedirect(order.order_number));
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
        {!user && (
          <Input
            ref={nameRef}
            label="Nome"
            placeholder="Digite seu nome"
            className="mb-4"
            required
          />
        )}

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
