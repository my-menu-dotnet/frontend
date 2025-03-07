"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Fragment,
} from "react";
import { useNotificationOrder } from "./useNotificationOrder";
import { Order } from "@/types/api/order/Order";
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
  Image,
  Raw,
} from "react-thermal-printer";
import { currency } from "@/utils/text";
import { Company } from "@/types/api/Company";
import useUser from "./queries/useUser";
import { OrderDiscount } from "@/types/api/order/OrderDiscount";
import { OrderItem } from "@/types/api/order/OrderItem";

type PrintContextProps = {
  grantPermissionToUsePrinter: () => void;
  print: (order: Order) => void;
};

const PrintContext = createContext<PrintContextProps | undefined>(undefined);

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const { company } = useUser();
  const { newOrder } = useNotificationOrder();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [port, setPort] = useState<any>();

  const grantPermissionToUsePrinter = async () => {
    // @ts-expect-error - Next dont has support
    const port = await window.navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    setPort(port);
  };

  const printNewOrder = async () => {
    if (!newOrder || !port || !company) {
      return;
    }
    print(newOrder);
  };

  const print = async (order: Order) => {
    if (!order || !company) {
      return;
    }

    const data = await render(getReceipt(order, company));

    const writer = port.writable?.getWriter();
    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }
  };

  useEffect(() => {
    printNewOrder();
  }, [newOrder]);

  console.log(port);

  return (
    <PrintContext.Provider value={{ grantPermissionToUsePrinter, print }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = (): PrintContextProps => {
  const context = useContext(PrintContext);
  if (context === undefined) {
    throw new Error("usePrint must be used within a PrintProvider");
  }
  return context;
};

const getReceipt = (order: Order, company: Company) => {
  const MAX_CARACTERS = 32;

  return (
    <Printer type="epson" width={MAX_CARACTERS} characterSet="pc860_portuguese">
      <Image
        src="https://my-menu.net/assets/images/hlogo-3.png"
        width={MAX_CARACTERS}
      />

      <Br />

      <Text size={{ width: 2, height: 2 }} align="center">
        {company.name}
      </Text>

      <Br />

      <Line />

      <Br />
      <Text size={{ width: 2, height: 2 }} align="center">
        PEDIDO #{String(order.order_number).padStart(3, "0")}
      </Text>
      <Br />

      <Line />

      <Row
        left="Nome"
        right={formattToMaxCaracters(order.user_name, MAX_CARACTERS - 5)}
      />
      <Row
        left="Tel."
        right={formattToMaxCaracters(order.user?.phone, MAX_CARACTERS - 5)}
      />
      <Row
        left="Email"
        right={formattToMaxCaracters(order.user?.email, MAX_CARACTERS - 6)}
      />

      <Br />

      <Text align="center">
        {order.address.neighborhood}, {order.address.street},{" "}
        {order.address.number}
      </Text>

      <Line />

      {order.order_items.map((item, index) => (
        <Fragment key={index}>
          <Row
            left={`${item.quantity} ${item.title}`}
            right={currency(item.unit_price * item.quantity)}
          />
          {item.observation && <Text>Obs: {item.observation}</Text>}
          {item.order_items?.map((subItem, subIndex) => (
            <Fragment key={subIndex}>
              <Row
                left={`${subItem.quantity} ${subItem.title}`}
                right={currency(subItem.unit_price * subItem.quantity)}
              />
            </Fragment>
          ))}
          {item.discount && (
            <Row left="Desconto" right={formattDiscount(item.discount)} />
          )}

          <Br />
        </Fragment>
      ))}

      <Line />

      <Row
        left="Subtotal"
        right={currency(calcTotalWithoutDiscount(order.order_items))}
      />
      <Row left="Taxa de entrega" right="R$ 0" />
      <Row
        left="Descontos"
        right={`- ${currency(calcTotalDiscount(order.order_items))}`}
      />

      <Br />

      <Row left="Total" right={currency(order.total_price)} />

      <Line />

      <Text align="center">Obrigado pela preferência!</Text>

      <Text align="center">
        *Esse cupom não tem valor fiscal, apenas informativo.
      </Text>
      <Cut />
    </Printer>
  );
};

const formattToMaxCaracters = (text: string | undefined, max: number) => {
  if (text && text.length > max) {
    return text.slice(0, max - 3) + "...";
  }
  return text || "";
};

const formattDiscount = (discount: OrderDiscount) => {
  if (discount.type === "PERCENTAGE") {
    return `- ${discount.discount}%`;
  }
  return `- R$ ${discount.discount}`;
};

export const calcTotalDiscount = (items: OrderItem[]) => {
  return items.reduce((acc, item) => {
    const currentTotal = item.unit_price * item.quantity;
    let currentoTotalWithDiscount = currentTotal;

    if (item.discount && item.discount.discount && item.discount.type) {
      if (item.discount.type === "PERCENTAGE") {
        currentoTotalWithDiscount =
          currentTotal - (currentTotal * item.discount.discount) / 100;
      } else {
        currentoTotalWithDiscount = currentTotal - item.discount.discount;
      }
    }

    return acc + (currentTotal - currentoTotalWithDiscount);
  }, 0);
};

export const calcTotalWithoutDiscount = (items: OrderItem[]) => {
  return items.reduce((acc, item) => {
    const currentTotal = item.unit_price * item.quantity;

    return (
      acc +
      currentTotal +
      (item.order_items?.reduce(
        (acc, subItem) => acc + subItem.unit_price * subItem.quantity,
        0
      ) || 0)
    );
  }, 0);
};
