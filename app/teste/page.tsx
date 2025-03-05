"use client";

import Button from "@/components/Button";
import { useState } from "react";
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
  Raw,
} from "react-thermal-printer";

export default function Page() {
  const [previewText, setPreviewText] = useState<Uint8Array>();

  const receipt = (
    <Printer type="epson" width={32} characterSet="korea">
      <Text size={{ width: 2, height: 2 }} align="center">
        PEDIDO #000
      </Text>
      <Br />
      <Line />

      <Row left="Cliente" right="Thiago Crepequer" />
      <Row left="Telefone" right="61 99999-9999" />
      <Row left="E-mail" right="crepequersthiag@gmail.com" />
      
      <Br />
      
      <Text align="center">SQN 113, Bloco B, Apartamento 304</Text>

      <Line />

      <Row left="Pizza de Calabresa" right="R$ 49,90" />
      <Text>- Sem cebola</Text>
      <Row left="Desconto" right="- 10%" />

      <Br />

      <Row left="Pizza de Frango" right="R$ 49,90" />
      <Text>- Sem cebola e com bastante queijo</Text>
      <Row left="Desconto" right="- 20%" />

      <Line />

      <Row left="Subtotal" right="R$ 89,80" />
      <Row left="Taxa de entrega" right="R$ 10,00" />
      <Row left="Descontos" right="- R$ 14,98" />

      <Br />

      <Row left="Total" right="R$ 84,82" />

      <Line />

      <Text align="center">Obrigado pela preferência!</Text>
      <Text align="center">Desenvolvido por My Menu</Text>
      <Cut />
    </Printer>
  );

  const fetchData = async () => {
    const data: Uint8Array = await render(receipt);

    // @ts-expect-error - teste
    const port = await window.navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const writer = port.writable?.getWriter();
    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }
  };

  return (
    <div>
      <Button onPress={fetchData} />

      {previewText && <Raw data={previewText} />}
    </div>
  );
}
