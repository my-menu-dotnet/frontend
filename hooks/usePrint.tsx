"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
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

type PrintContextProps = {
  grantPermissionToUsePrinter: () => void;
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

  const tryToPrint = async () => {
    if (!newOrder || !port || !company) {
      return;
    }

    const data = await render(getReceipt(newOrder, company));

    const writer = port.writable?.getWriter();
    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }
  };

  useEffect(() => {
    tryToPrint();
  }, [newOrder]);

  console.log(port);

  return (
    <PrintContext.Provider value={{ grantPermissionToUsePrinter }}>
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
        right={formattToMaxCaracters(order.user.name, MAX_CARACTERS - 5)}
      />
      <Row
        left="Tel."
        right={formattToMaxCaracters(order.user.phone, MAX_CARACTERS - 5)}
      />
      <Row
        left="Email"
        right={formattToMaxCaracters(order.user.email, MAX_CARACTERS - 6)}
      />

      <Br />

      <Text align="center">SQN 113, Bloco B, Apartamento 304</Text>

      <Line />

      {order.order_items.map((item, index) => (
        <>
          <Row
            left={`${item.quantity} ${item.title}`}
            right={currency(item.unit_price * item.quantity)}
          />
          {/* <Text>- Sem cebola</Text> */}
          {/* <Row left="Desconto" right="- 10%" /> */}

          <Br />
        </>
      ))}

      <Line />

      <Row left="Subtotal" right={currency(order.total_price)} />
      <Row left="Taxa de entrega" right="R$ 0" />
      <Row left="Descontos" right="- R$ 0" />

      <Br />

      <Row left="Total" right={currency(order.total_price)} />

      <Line />

      <Text align="center">Obrigado pela preferência!</Text>
      <Text align="center">By: My Menu</Text>

      <Image
        src="https://my-menu.net/assets/images/logo.png"
        width={MAX_CARACTERS}
        align="center"
      />

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
