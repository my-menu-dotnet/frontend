"use client";

import Block from "@/components/Block";
import Button from "@/components/Button";
import ClientFormModal from "@/components/Dashboard/Client/ClientFormModal";
import ClientTable from "@/components/Dashboard/Client/ClientTable";
import { useState } from "react";
import { GoPlus } from "react-icons/go";

export default function ClientsPage() {
  const [open, setOpen] = useState(false);

  return (
    <Block>
      <div className="w-full flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">Clientes</h1>
          <p className="text-sm text-gray-500">
            Gerencie os clientes cadastrados. Ao buscar um nome no pedido manual,
            clientes cadastrados aparecerão para seleção.
          </p>
        </div>
        <Button
          onPress={() => setOpen(true)}
          data-test="add-client"
          startContent={<GoPlus size={20} />}
        >
          Adicionar cliente
        </Button>
      </div>

      <ClientTable />

      <ClientFormModal isOpen={open} onClose={() => setOpen(false)} />
    </Block>
  );
}
